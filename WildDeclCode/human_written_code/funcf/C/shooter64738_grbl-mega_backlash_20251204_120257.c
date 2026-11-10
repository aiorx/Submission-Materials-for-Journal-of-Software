```c
void backlash_initialize()
{
	//memset(back_lash_compensation.new_comp_direction,0,sizeof(back_lash_compensation.new_comp_direction));
	memset(back_lash_compensation.last_comp_direction,0,sizeof(back_lash_compensation.last_comp_direction));
	memset(back_lash_compensation.comp_per_axis_mm,0,sizeof(back_lash_compensation.comp_per_axis_mm));
}
```