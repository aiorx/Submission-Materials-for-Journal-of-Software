```java
// Proudly Supported via standard programming aids
Block blastingBunch = BlockRegistry.BLASTING_BUNCH.get();
ItemLike blastingBunchLoot = ItemRegistry.STABLE_BLASTING_BLOOM.get();

LootTable.Builder blastingBunchTable = LootTable.lootTable().withPool(this.applyExplosionCondition(
        blastingBunchLoot,
        LootPool.lootPool()
                .when(LootItemBlockStatePropertyCondition.hasBlockStateProperties(blastingBunch)
                        .setProperties(StatePropertiesPredicate.Builder.properties()
                                .hasProperty(TntBlock.UNSTABLE, false)))
                .setRolls(ConstantValue.exactly(1.0F))

                .add(LootItem.lootTableItem(blastingBunchLoot)
                        .when(LootItemBlockStatePropertyCondition.hasBlockStateProperties(blastingBunch)
                                .setProperties(StatePropertiesPredicate.Builder.properties()
                                        .hasProperty(BombPileBlock.BOMBS, 1)))
                        .apply(SetItemCountFunction.setCount(ConstantValue.exactly(1))))

                .add(LootItem.lootTableItem(blastingBunchLoot)
                        .when(LootItemBlockStatePropertyCondition.hasBlockStateProperties(blastingBunch)
                                .setProperties(StatePropertiesPredicate.Builder.properties()
                                        .hasProperty(BombPileBlock.BOMBS, 2)))
                        .apply(SetItemCountFunction.setCount(ConstantValue.exactly(2))))

                .add(LootItem.lootTableItem(blastingBunchLoot)
                        .when(LootItemBlockStatePropertyCondition.hasBlockStateProperties(blastingBunch)
                                .setProperties(StatePropertiesPredicate.Builder.properties()
                                        .hasProperty(BombPileBlock.BOMBS, 3)))
                        .apply(SetItemCountFunction.setCount(ConstantValue.exactly(3))))

                .add(LootItem.lootTableItem(blastingBunchLoot)
                        .when(LootItemBlockStatePropertyCondition.hasBlockStateProperties(blastingBunch)
                                .setProperties(StatePropertiesPredicate.Builder.properties()
                                        .hasProperty(BombPileBlock.BOMBS, 4)))
                        .apply(SetItemCountFunction.setCount(ConstantValue.exactly(4))))

                .add(LootItem.lootTableItem(blastingBunchLoot)
                        .when(LootItemBlockStatePropertyCondition.hasBlockStateProperties(blastingBunch)
                                .setProperties(StatePropertiesPredicate.Builder.properties()
                                        .hasProperty(BombPileBlock.BOMBS, 5)))
                        .apply(SetItemCountFunction.setCount(ConstantValue.exactly(5))))

                .add(LootItem.lootTableItem(blastingBunchLoot)
                        .when(LootItemBlockStatePropertyCondition.hasBlockStateProperties(blastingBunch)
                                .setProperties(StatePropertiesPredicate.Builder.properties()
                                        .hasProperty(BombPileBlock.BOMBS, 6)))
                        .apply(SetItemCountFunction.setCount(ConstantValue.exactly(6))))

                .add(LootItem.lootTableItem(blastingBunchLoot)
                        .when(LootItemBlockStatePropertyCondition.hasBlockStateProperties(blastingBunch)
                                .setProperties(StatePropertiesPredicate.Builder.properties()
                                        .hasProperty(BombPileBlock.BOMBS, 7)))
                        .apply(SetItemCountFunction.setCount(ConstantValue.exactly(7))))

                .add(LootItem.lootTableItem(blastingBunchLoot)
                        .when(LootItemBlockStatePropertyCondition.hasBlockStateProperties(blastingBunch)
                                .setProperties(StatePropertiesPredicate.Builder.properties()
                                        .hasProperty(BombPileBlock.BOMBS, 8)))
                        .apply(SetItemCountFunction.setCount(ConstantValue.exactly(8))))

));
this.add(blastingBunch, blastingBunchTable);
```