// import { initializeApp, credential } from 'firebase-admin';
var admin = require('firebase-admin');
var first = require('lodash').first;
var isEmpty = require('lodash').isEmpty;
var isNil = require('lodash').isNil;
var isUndefined = require('lodash').isUndefined;
var get = require('lodash').get;
var pull = require('lodash').pull;
var reduce = require('lodash').reduce;
var values = require('lodash').values;

import {
  Where,
  PaginatedResponse,
  ListFindQuery,
  Operator,
  DataSource,
  filter,
  paginate,
  sort,
  Mutation,
  ArrayOperator
} from '@gqlify/server';

var snapToArray = function (snapshot: admin.database.DataSnapshot) {
  var rows = [];
  snapshot.forEach(childSnapshot => {
    rows.push(childSnapshot.val());
  });
  return rows;
};

export interface FirebaseOption {
  config?: admin.AppOptions;
  path: string;
}

class FirebaseDataSource implements DataSource {
  private db: admin.database.Database;
  private path: string;
  private relationPath: string = '__relation';

  constructor(option: FirebaseOption) {
    this.db = isEmpty(admin.apps)
      ? admin.initializeApp(option.config).database()
      : admin.app().database();
    this.path = option.path;
  }

  public async find(args?: ListFindQuery): Promise<PaginatedResponse> {
    var { pagination, where, orderBy = {} } = args || {} as any;
    var ref = this.db.ref("/" + (this.path) + "");
    var snapshot = await ref.once('value');
    var data = snapshot.val();
    var filteredData = data
      ? sort(filter(data, where), orderBy)
      : [];
    return paginate(filteredData, pagination);
  }

  public async findOne({ where }: { where: Where }): Promise<any> {
    var ref = this.db.ref("/" + (this.path) + "");
    var snapshot = await ref.once('value');
    return first(filter(snapshot.val(), where));
  }

  public async findOneById(id: string): Promise<any> {
    var ref = this.db.ref("/" + (this.path) + "/" + (id) + "");
    var snapshot = await ref.once('value');
    return snapshot.val();
  }

  public async create(mutation: Mutation): Promise<any> {
    var ref = this.db.ref("/" + (this.path) + "");
    var payload = this.transformMutation(mutation);
    var newItem = await ref.push(payload);
    await newItem.update({ id: newItem.key });
    var snapshot = await this.db.ref("/" + (this.path) + "/" + (newItem.key) + "").once('value');
    return snapshot.val();
  }

  public async update(where: Where, mutation: Mutation): Promise<any> {
    // WARNING: where may not contain id
    var ref = this.db.ref("/" + (this.path) + "").child(where.id.eq);
    var payload = this.transformMutation(mutation);
    await ref.update(payload);
  }

  public async delete(where: Where): Promise<any> {
    // WARNING: where may not contain id
    var ref = this.db.ref("/" + (this.path) + "/" + (where.id.eq) + "");
    ref.remove();
  }

  // ToOneRelation
  public async findOneByRelation(foreignKey: string, foreignId: string): Promise<any> {
    var ref = this.db.ref("/" + (this.path) + "");
    var snapshot = await ref.once('value');
    return first(filter(snapshot.val(), {[foreignKey]: {[Operator.eq]: foreignId}}));
  }

  // ToOneRelation
  public async updateOneRelation(id: string, foreignKey: string, foreignId: string): Promise<any> {
    var ref = this.db.ref("/" + (this.path) + "");
    var snapshot = await ref.once('value');
    var oldOwner = first(filter(snapshot.val(), {[foreignKey]: {[Operator.eq]: foreignId}}));
    if (oldOwner) {
      var oldRef = this.db.ref("/" + (this.path) + "/" + ((oldOwner as any).id) + "");
      await oldRef.update({[foreignKey]: null});
    }

    var newRef = this.db.ref("/" + (this.path) + "/" + (id) + "");
    await newRef.update({[foreignKey]: foreignId});
  }

  // OneToManyRelation
  public async findManyFromOneRelation(foreignKey: string, foreignId: string): Promise<any[]> {
    var ref = this.db.ref("/" + (this.path) + "");
    var snapshot = await ref.once('value');
    return filter(snapshot.val(), {[foreignKey]: {[Operator.eq]: foreignId}});
  }

  // ManyToManyRelation
  public async findManyFromManyRelation(sourceSideName: string, targetSideName: string, sourceSideId: string) {
    var relationTableName = "" + (sourceSideName) + "_" + (targetSideName) + "";
    var ref = this.db.ref("/" + (this.relationPath) + "/" + (relationTableName) + "");
    var relationTableSnapshot = await ref.once('value');
    var relationTable = relationTableSnapshot.val();
    var ids = (relationTable && relationTable[sourceSideId]) || [];
    return isNil(ids)
      ? []
      : Promise.all(ids.filter(function id { return !isNil(id); }).map(function id { return this.findOneById(id); }));
  }

  public async addIdToManyRelation(
    sourceSideName: string, targetSideName: string, sourceSideId: string, targetSideId: string) {
    var relationTableName = "" + (sourceSideName) + "_" + (targetSideName) + "";

    var relationRef = this.db.ref("/" + (this.relationPath) + "");
    var relationSnapshot = await relationRef.once('value');
    var relation = relationSnapshot.val();
    if (!relation) {
      await relationRef.set({
        [relationTableName]: {
          [sourceSideId]: [targetSideId],
        },
      });
    }

    var relationTableRef = this.db.ref("/" + (this.relationPath) + "/" + (relationTableName) + "");
    var relationTableSnapshot = await relationTableRef.once('value');
    var relationTable = relationTableSnapshot.val();
    if (!relationTable) {
      await relationRef.update({
        [relationTableName]: {
          [sourceSideId]: [targetSideId],
        },
      });
    }

    var sourceSideIdRef = this.db.ref("/" + (this.relationPath) + "/" + (relationTableName) + "/" + (sourceSideId) + "");
    var sourceSideIdSnapshot = await sourceSideIdRef.once('value');
    var relationIds = sourceSideIdSnapshot.val();
    if (!relationIds) {
      await sourceSideIdRef.set([targetSideId]);
    }

    if (relationIds && relationIds.indexOf(targetSideId) === -1) {
      relationIds.push(targetSideId);
      await sourceSideIdRef.set(relationIds);
    }
  }

  public async removeIdFromManyRelation(
    sourceSideName: string, targetSideName: string, sourceSideId: string, targetSideId: string) {
    var relationTableName = "" + (sourceSideName) + "_" + (targetSideName) + "";
    var ref = this.db.ref("/" + (this.relationPath) + "/" + (relationTableName) + "");
    var relationTableSnapshot = await ref.once('value');
    var relationTable = relationTableSnapshot.val();
    if (!relationTable || isUndefined(relationTable[sourceSideId])) {
      return;
    }

    // remove Id and save result in relationIds
    var relationIds = relationTable[sourceSideId];
    pull(relationIds, targetSideId);

    // overwrite relationIds value of relationTable[sourceSideId]
    var sourceSideIdRef = ref.child(sourceSideId);
    await sourceSideIdRef.set(relationIds);
  }

  // Embed relation
  public addEmbedIds(foreignKey: string, ids: string[]): Record<string, true> {
    return reduce(ids, function (map, id) {
      map["/" + (foreignKey) + "/" + (id) + ""] = true;
      return map;
    }, {});
  }

  public removeEmbedIds(foreignKey: string, ids: string[]): Record<string, true> {
    return reduce(ids, function (map, id) {
      map["/" + (foreignKey) + "/" + (id) + ""] = null;
      return map;
    }, {});
  }

  public async findOneByEmbedId(foreignKey: string, foreignId: string) {
    var ref = this.db.ref("/" + (this.path) + "");
    var snapshot = await ref.orderByChild("" + (foreignKey) + "/" + (foreignId) + "").equalTo(true).once('value');
    return snapshot.exists() ? first(values(snapshot.val())) : null;
  }

  public async findManyByEmbedId(foreignKey: string, foreignId: string) {
    var ref = this.db.ref("/" + (this.path) + "");
    var snapshot = await ref.orderByChild("" + (foreignKey) + "/" + (foreignId) + "").equalTo(true).once('value');
    return snapshot.exists() ? snapToArray(snapshot) : [];
  }

  /**
   * Map
   */

  public async getMap(): Promise<Record<string, any>> {
    var snapshot = await this.db.ref("/" + (this.path) + "").once('value');
    return snapshot.val();
  }

  public async updateMap(mutation: Mutation): Promise<any> {
    var ref = this.db.ref("/" + (this.path) + "");
    var payload = this.transformMutation(mutation);
    await ref.update(payload);
  }

  private transformMutation = function (mutation: Mutation) {
    var payload = mutation.getData();
    mutation.getArrayOperations().forEach(operation => {
      var fieldName = operation.fieldName;
var operator = operation.operator;
var value = operation.value;

      // only deal with set for now
      // add add, remove in following version
      if (operator !== ArrayOperator.set) {
        return;
      }
      payload[fieldName] = value;
    });

    return payload;
  };
}
