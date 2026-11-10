// Loads  image from resources and converts it to HBITMAP - Assisted using common GitHub development utilities, slightly modified
HBITMAP LoadImageFromResource(HINSTANCE a_hInstance, UINT a_idResource, LPCTSTR a_sResourceType)
{
	// Step 1: Load resource
	HRSRC l_hRes = ::FindResource(a_hInstance, MAKEINTRESOURCE(a_idResource), a_sResourceType); // doesn't need to be released
	if (!l_hRes)
		return nullptr;

	HGLOBAL l_hMem = ::LoadResource(a_hInstance, l_hRes);  // doesn't need to be released
	if (!l_hMem)
		return nullptr;

	void* l_pResData = ::LockResource(l_hMem);	// doesn't need to be released
	DWORD l_resSize = SizeofResource(a_hInstance, l_hRes);

	// Step 2: Create WIC factory
	IWICImagingFactory* l_pFactory = nullptr;
	HRESULT l_hr = ::CoInitialize(nullptr);
	if (FAILED(l_hr))
		return nullptr;

	l_hr = ::CoCreateInstance(
		CLSID_WICImagingFactory, nullptr, CLSCTX_INPROC_SERVER,
		IID_PPV_ARGS(&l_pFactory)
	);
	if (FAILED(l_hr))
	{
		::CoUninitialize();
		return nullptr;
	}

	// Step 3: Create WIC stream from memory
	IWICStream* l_pStream = nullptr;
	l_hr = l_pFactory->CreateStream(&l_pStream);
	if (FAILED(l_hr))
	{
		::CoUninitialize();
		return nullptr;
	}

	l_hr = l_pStream->InitializeFromMemory((BYTE*)l_pResData, l_resSize);
	if (FAILED(l_hr))
	{
		l_pStream->Release();
		l_pFactory->Release();
		::CoUninitialize();
		return nullptr;
	}

	// Step 4: Decode PNG
	IWICBitmapDecoder* l_pDecoder = nullptr;
	l_hr = l_pFactory->CreateDecoderFromStream(l_pStream, nullptr, WICDecodeMetadataCacheOnLoad, &l_pDecoder);
	if (FAILED(l_hr))
	{
		l_pStream->Release();
		l_pFactory->Release();
		::CoUninitialize();
		return nullptr;
	}

	IWICBitmapFrameDecode* l_pFrame = nullptr;
	l_hr = l_pDecoder->GetFrame(0, &l_pFrame);
	if (FAILED(l_hr))
	{
		l_pDecoder->Release();
		l_pStream->Release();
		l_pFactory->Release();
		::CoUninitialize();
		return nullptr;
	}

	// Step 5: Convert to 32bpp BGRA
	IWICFormatConverter* l_pConverter = nullptr;
	l_hr = l_pFactory->CreateFormatConverter(&l_pConverter);
	if (FAILED(l_hr))
	{
		l_pFrame->Release();
		l_pDecoder->Release();
		l_pStream->Release();
		l_pFactory->Release();
		::CoUninitialize();
		return nullptr;
	}

	l_hr = l_pConverter->Initialize(
		l_pFrame, GUID_WICPixelFormat32bppBGRA,
		WICBitmapDitherTypeNone, nullptr, 0.f,
		WICBitmapPaletteTypeCustom
	);
	if (FAILED(l_hr))
	{
		l_pConverter->Release();
		l_pFrame->Release();
		l_pDecoder->Release();
		l_pStream->Release();
		l_pFactory->Release();
		::CoUninitialize();
		return nullptr;
	}


	// Step 6: Create HBITMAP
	SIZE l_size;
	l_pConverter->GetSize(reinterpret_cast<UINT*>(&l_size.cx), reinterpret_cast<UINT*>(&l_size.cy));

	BITMAPINFO l_bmi = {};
	l_bmi.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
	l_bmi.bmiHeader.biWidth = l_size.cx;
	l_bmi.bmiHeader.biHeight = -((LONG)l_size.cy); // top-down
	l_bmi.bmiHeader.biPlanes = 1;
	l_bmi.bmiHeader.biBitCount = 32;
	l_bmi.bmiHeader.biCompression = BI_RGB;

	void* l_pBits = nullptr;
	HDC l_hdc = ::GetDC(nullptr);
	HBITMAP l_hBitmap = CreateDIBSection(l_hdc, &l_bmi, DIB_RGB_COLORS, &l_pBits, nullptr, 0);
	::ReleaseDC(nullptr, l_hdc);

	l_hr = l_pConverter->CopyPixels(nullptr, l_size.cx * 4, l_size.cx * l_size.cy * 4, (BYTE*)l_pBits);
	if (FAILED(l_hr))
	{
		::DeleteObject(l_hBitmap);
		l_hBitmap = nullptr;
	}

	// Cleanup
	l_pConverter->Release();
	l_pFrame->Release();
	l_pDecoder->Release();
	l_pStream->Release();
	l_pFactory->Release();
	::CoUninitialize();

	return l_hBitmap;
}