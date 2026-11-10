```cpp
void upgradeStamina(Karakter& k) {
    k.stam = k.stam + k.stam * 5 / 100;
    k.lvl++;
}
```