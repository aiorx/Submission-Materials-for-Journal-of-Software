#pragma once

#include "CoreMinimal.h"
#include "AddIconToSlateSheet.generated.h"
/*
 * This Code is Assisted with basic coding tools-o1
 */
class FSlateStyleSet;

/**
 * 负责注册和管理本插件的 Slate 样式（包括图标）
 */

class FMyPluginStyle
{
public:

	/** 初始化：创建并注册 StyleSet */
	static void Initialize();

	/** 反初始化：从 Slate 注册表卸载 StyleSet */
	static void Shutdown();

	/** 获取 StyleSet 的名字 */
	static FName GetStyleSetName();

	/** 获取实际的 StyleSet 对象 */
	static const class ISlateStyle& Get();

private:

	/** 创建一个 StyleSet 并把我们想要的所有资源（图标）注册进来 */
	static TSharedRef< FSlateStyleSet > Create();

private:
	static TSharedPtr< FSlateStyleSet > StyleInstance;
};

UCLASS()
class UMyPluginStyleBPLibrary : public UBlueprintFunctionLibrary
{
	GENERATED_BODY()

public:

	/** 注册样式（如果尚未注册） */
	UFUNCTION(BlueprintCallable, Category="MyPlugin|Style")
	static void RegisterMyPluginStyle()
	{
		FMyPluginStyle::Initialize();
	}

	/** 反注册样式 */
	UFUNCTION(BlueprintCallable, Category="MyPlugin|Style")
	static void UnregisterMyPluginStyle()
	{
		FMyPluginStyle::Shutdown();
	}
};