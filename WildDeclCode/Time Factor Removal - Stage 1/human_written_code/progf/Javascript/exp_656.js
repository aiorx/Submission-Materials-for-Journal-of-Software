"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

var parseMultipartData = require.parseMultipartData;
var sanitizeEntity = require.sanitizeEntity;("strapi-utils");

module.exports = {
  async create(ctx) {
    var entity;
    if (ctx.is("multipart")) {
      var data = parseMultipartData.data;
var files = parseMultipartData.files;(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services.favorite.create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.favorite.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.favorite });
  },

  async delete(ctx) {
    var id = ctx.params.id;

    var [favorite] = await strapi.services.favorite.find({
      id,
      user: ctx.state.user.id,
    });

    if (!favorite) return ctx.unauthorized("You can't update this entry.");

    var entity = await strapi.services.favorite.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.favorite });
  },

  async userFavorites(ctx) {
    var favorites = await strapi.services.favorite.find({
      user: ctx.state.user.id,
    });

    await Promise.all(
      favorites.map(async function (favorite, i) {
        var variants = await strapi.services.variant.find({
          product: favorite.variant.product,
        });

        variants.forEach((variant) => {
          delete variant.created_by;
          delete variant.updated_by;
        });

        favorites[i].variants = variants;
        delete favorites[i].user;
        delete favorites[i].updated_by;
        delete favorites[i].created_by;
      })
    );

    ctx.send(favorites, 200);
  },
};
