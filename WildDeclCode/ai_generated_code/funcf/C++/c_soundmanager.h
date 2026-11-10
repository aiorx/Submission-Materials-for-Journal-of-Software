//
// Auto-Built using basic development resources-4 on May 25 2023
//
K2_API void          Start() {}
K2_API void          Restart() {}
K2_API void          Frame() {}
K2_API void          Stop() {}
K2_API void          StopStreamingImmediately() {}
K2_API void          RefreshDrivers() {}
K2_API bool          GetDriver(int iDriver, tstring &sDriverReturn) { return false; }
K2_API bool          GetRecordDriver(int iDriver, tstring &sDriverReturn) { return false; }
K2_API FMOD::Sound*  LoadSample(const tstring &sPath, int iSoundFlags) { return nullptr; }
K2_API byte*         GetSampleData(CSample *pSample, uint uLength, uint uOffset) { return nullptr; }
K2_API bool          GetSampleData(CSample *pSample, byte *pTarget, uint uLength, uint uOffset) { return false; }
K2_API uint          GetSampleLength(CSample *pSample) { return 0; }
K2_API void          FreeSample(FMOD::Sound* pSample) {}
K2_API void          ReleaseSoundNextTick(FMOD::Sound* pSample) {}
K2_API FMOD::Sound*  CreateSound(int iFrequency, int iNumChannels, int iNumBits, uint uiBufferSize, int iSoundFlags = 0) { return nullptr; }
K2_API FMOD::Sound*  CreateExtendedSound(FMOD_CREATESOUNDEXINFO &exInfo, int iSoundFlags = 0) { return nullptr; }
K2_API void          ResetWorldGeometry(int iMaxPolys, int iMaxVertices, float fMaxWorldSize) {}
K2_API void          AddWorldGeometry(CVec3f &a, CVec3f &b, CVec3f &c) {}
K2_API CSample*      StartRecording(int iFrequency, uint uiBufferSize) { return nullptr; }
K2_API void          StopRecording() {}
K2_API uint          GetRecordingPos() { return 0; }
K2_API CSample*      GetRecordTarget() { return nullptr; }
K2_API uint          ModifySampleAtPos(CSample *pSample, uint uPos, uint uLength, byte *pData) { return 0; }
K2_API uint          ResetSampleAtPos(CSample *pSample, uint uPos, uint uLength) { return 0; }
K2_API SoundHandle   Play2DSound          (ResHandle hSample, float fVolume = 1.0f, int iChannel = CHANNEL_AUTO, int iPriority = 10, float fDampen = 1.0f) { return INVALID_INDEX; }
K2_API SoundHandle   Play2DSound          (CSample *pSample, float fVolume = 1.0f, int iChannel = CHANNEL_AUTO, int iPriority = 10, float fDampen = 1.0f) { return INVALID_INDEX; }
K2_API SoundHandle   PlayVoiceSound       (ResHandle hSample, float fVolume = 1.0f, int iChannel = CHANNEL_AUTO, int iPriority = 10) { return INVALID_INDEX; }
K2_API SoundHandle   PlayVoiceSound       (CSample *pSample, float fVolume = 1.0f, int iChannel = CHANNEL_AUTO, int iPriority = 10) { return INVALID_INDEX; }
K2_API SoundHandle   PlaySFXSound         (ResHandle hSample, const CVec3f *pv3Pos, const CVec3f *pv3Vel, float fVolume = 1, float fFalloff = -1.0f, int iChannel = CHANNEL_AUTO, int iPriority = 128, int iSoundFlags = 0, int iFadeIn = 0, int iFadeOutStartTime = 0, int iFadeOut = 0, int iSpeedUpTime = 0, float fSpeed1 = 1.0, float fSpeed2 = 1.0, int iSlowDownTime = 0, float fFalloffEnd = 0.0f) { return INVALID_INDEX; }
K2_API SoundHandle   PlaySFXSound         (CSample *pSample, const CVec3f *pv3Pos, const CVec3f *pv3Vel, float fVolume = 1, float fFalloff = -1.0f, int iChannel = CHANNEL_AUTO, int iPriority = 128, int iSoundFlags = 0, int iFadeIn = 0, int iFadeOutStartTime = 0, int iFadeOut = 0, int iSpeedUpTime = 0, float fSpeed1 = 1.0, float fSpeed2 = 1.0, int iSlowDownTime = 0, float fFalloffEnd = 0.0f) { return INVALID_INDEX; }
K2_API SoundHandle   Play2DSFXSound       (ResHandle hSample, float fVolume = 1, int iChannel = CHANNEL_AUTO, int iPriority = 128, bool bLoop = false, int iFadeIn = 0, int iFadeOutStartTime = 0, int iFadeOut = 0, int iSpeedUpTime = 0, float fSpeed1 = 1.0, float fSpeed2 = 1.0, int iSlowDownTime = 0) { return INVALID_INDEX; }
K2_API SoundHandle   Play2DSFXSound       (CSample *pSample, float fVolume = 1, int iChannel = CHANNEL_AUTO, int iPriority = 128, bool bLoop = false, int iFadeIn = 0, int iFadeOutStartTime = 0, int iFadeOut = 0, int iSpeedUpTime = 0, float fSpeed1 = 1.0, float fSpeed2 = 1.0, int iSlowDownTime = 0) { return INVALID_INDEX; }
K2_API SoundHandle   PlayWorldSFXSound    (ResHandle hSample, const CVec3f *pv3Pos, float fVolume = 1, float fFalloff = -1.0f, int iChannel = CHANNEL_AUTO, int iPriority = 150, bool bLoop = false) { return INVALID_INDEX; }
K2_API SoundHandle   PlayWorldSFXSound    (CSample *pSample, const CVec3f *pv3Pos, float fVolume = 1, float fFalloff = -1.0f, int iChannel = CHANNEL_AUTO, int iPriority = 150, bool bLoop = false) { return INVALID_INDEX; }
K2_API void          SetListenerPosition  (const CVec3f &v3Pos, const CVec3f &v3Velocity, const CVec3f &v3Forward, const CVec3f &v3Up, bool bWarp) {}
K2_API void          SetPlayPosition      (SoundHandle hHandle, uint uiPos) {}
K2_API void          SetVolume            (SoundHandle hHandle, float fVolume) {}
K2_API void          SetMute              (SoundHandle hHandle, bool bMute) {}
K2_API void          StopChannel          (int iChannel) {}
K2_API void          StopHandle           (SoundHandle hHandle) {}
K2_API bool          UpdateHandle         (SoundHandle hHandle, const CVec3f &v3Pos, const CVec3f &v3Vel, bool b3DSound = true) { return true; }
K2_API void          PlayMusic            (const tstring &sStreamFile, bool bLoop, bool bCrossFade = false, bool bFromPlaylist = false) {}
K2_API void          PlayPlaylist         (const tsvector &vPlaylist, bool bShuffle) {}
K2_API void          StopMusic            (bool bFadeOut = true, bool bClearPlaylist = true, uint uiDelayFrames = 0) {}
K2_API void          ClearPlaylist        () {}
K2_API void          MuteSFX              (bool bMute) {}
K2_API void          SetInterfaceVolume   (float fVolume) {}
K2_API void          SetSFXVolume         (float fVolume) {}
K2_API void          SetVoiceVolume       (float fVolume) {}
K2_API void          SetMusicVolume       (float fVolume) {}
K2_API uint          GetChannelPosition   (SoundHandle hHandle) { return 0; }
K2_API uint          GetTime              (SoundHandle hPlaying) { return 0; }
K2_API uint          GetDuration          (SoundHandle hPlaying) { return 0; }
K2_API const tstring&GetCurrentMusicName  () { return TSNULL; }
K2_API uint          GetCurrentMusicTime  () { return 0; }
K2_API uint          GetCurrentMusicDuration() { return 0; }
K2_API void          SetCurrentMusicTime  (int iMillisec) {}
K2_API const tsvector&GetCurrentPlaylist () { static tsvector vEmpty; return vEmpty; }
K2_API int           GetCurrentPlaylistIdx() { return 0; }
void                 StopActiveSound      (FMOD::Channel *pChannel) {}
void                 MusicStopped         (FMOD::Channel *pChannel) {}
void                 SoundTest            (uint uiMs, uint uiFreq) {}
bool                 GetPlaylistActive    () { return false; }
void                 SetFalloffBias       (float fFalloffBias)  {}
float                GetFalloffBias       () const { return 0; }
void                 SetCenter            (const CVec3f &v3Center) {}
const CVec3f&        GetCenter            () const { static CVec3f v3Zero(V3_ZERO); return v3Zero; }

K2_API bool          IsHandleActive(SoundHandle hHandle) { return false; }
bool                 IsChannelAvailable(int iChannel)    { return false; }

K2_API tstring       GetRecordDriverName()               { return TSNULL; }