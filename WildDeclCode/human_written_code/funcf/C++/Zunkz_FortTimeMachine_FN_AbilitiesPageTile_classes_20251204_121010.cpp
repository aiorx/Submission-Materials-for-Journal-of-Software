```cpp
void UAbilitiesPageTile_C::SetAbilityKeybindVisibility(bool bVisible)
{
    if (bVisible)
    {
        SizeBoxAbilityKeybind->SetVisibility(ESlateVisibility::Visible);
    }
    else
    {
        SizeBoxAbilityKeybind->SetVisibility(ESlateVisibility::Collapsed);
    }
}
```