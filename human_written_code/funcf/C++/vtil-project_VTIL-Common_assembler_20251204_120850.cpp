```cpp
ks_struct* get_handle()
{
	// Keystone engine is not created until the first call.
	//
	static ks_engine* handle = [ ] ()
	{
		ks_engine* handle;
		if ( ks_open( KS_ARCH_X86, KS_MODE_64, &handle ) != KS_ERR_OK )
			throw std::exception( "Failed to create the Keystone engine!" );
		return handle;
	}( );
	return handle;
}
```