#include "AddIconToSlateSheet.h"
#include "Styling/SlateStyle.h"
#include "Styling/SlateStyleRegistry.h"
#include "Interfaces/IPluginManager.h"
#include "Misc/Paths.h"
TSharedPtr< FSlateStyleSet > FMyPluginStyle::StyleInstance = nullptr;

// 方便宏定义，少敲代码
#define IMAGE_BRUSH( RelativePath, ... ) FSlateImageBrush( Style->RootToContentDir( RelativePath, TEXT(".png") ), __VA_ARGS__ )
/*
 * This Code is Aided using common development resources-o1
 */

void FMyPluginStyle::Initialize()
{
	// 如果已经注册过，就别重复注册
	if (StyleInstance.IsValid())
	{
		return;
	}

	// 创建 StyleSet
	StyleInstance = Create();

	// 向全局 SlateStyleRegistry 注册
	FSlateStyleRegistry::RegisterSlateStyle(*StyleInstance.Get());
}

void FMyPluginStyle::Shutdown()
{
	// 反注册并释放
	if (StyleInstance.IsValid())
	{
		FSlateStyleRegistry::UnRegisterSlateStyle(*StyleInstance.Get());
		ensure(StyleInstance.IsUnique());
		StyleInstance.Reset();
	}
}

FName FMyPluginStyle::GetStyleSetName()
{
	static FName StyleSetName(TEXT("MyPluginStyle"));
	return StyleSetName;
}

TSharedRef< FSlateStyleSet > FMyPluginStyle::Create()
{
	// 创建一个新的 SlateStyleSet
	TSharedRef< FSlateStyleSet > Style = MakeShareable(new FSlateStyleSet(GetStyleSetName()));

	// 设置 ContentRoot 为插件的 Resources 目录
	// 这样 RelativePath("Icon64") 会被映射到 MyPlugin/Resources/Icon64.png
	FString PluginDir =  FPaths::ProjectContentDir() ;//IPluginManager::Get().FindPlugin(TEXT("MyPlugin"))->GetBaseDir();
	
	Style->SetContentRoot(FPaths::Combine(*PluginDir, TEXT("Textures")));

	// 在这里注册你的图标
	// 1) key: "MyPlugin.Icon64"   2) brush: IMAGE_BRUSH("Icon64", FVector2D(64,64))
	Style->Set("miku.Icon64", new IMAGE_BRUSH(TEXT("miku"), FVector2D(128, 128)));

	return Style;
}

const ISlateStyle& FMyPluginStyle::Get()
{
	return *StyleInstance.Get();
}

#undef IMAGE_BRUSH
