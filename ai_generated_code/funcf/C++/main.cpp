```cpp
	mlir::RewritePatternSet patterns(&context);
	mlir::LLVMTypeConverter typeConverter(&context);
	mlir::populateFuncToLLVMConversionPatterns(typeConverter, patterns);
	mlir::arith::populateArithToLLVMConversionPatterns(typeConverter, patterns);
	mlir::populateMathToLLVMConversionPatterns(typeConverter, patterns);
	mlir::populateFinalizeMemRefToLLVMConversionPatterns(typeConverter, patterns);

	LLVMConversionTarget target(context);

	target.addLegalDialect<mlir::LLVM::LLVMDialect>();
	target.addLegalOp<mlir::ModuleOp>();
	target.addIllegalOp<mlir::func::FuncOp>();
	target.addIllegalOp<mlir::func::ReturnOp>();
	target.addIllegalDialect<mlir::func::FuncDialect>();
	target.addIllegalDialect<mlir::arith::ArithDialect>();
	target.addIllegalDialect<mlir::math::MathDialect>();
	target.addIllegalDialect<mlir::memref::MemRefDialect>();
	mlir::registerBuiltinDialectTranslation(context);
	//mlir::func::registerFuncDialectTranslation(context);
	//mlir::arith::registerArithDialectTranslation(context);
	//mlir::math::registerMathDialectTranslation(context);
	//mlir::memref::registerMemRefDialectTranslation(context);
	//mlir::registerLLVMDialectTranslation(registry);
	context.appendDialectRegistry(registry);
```