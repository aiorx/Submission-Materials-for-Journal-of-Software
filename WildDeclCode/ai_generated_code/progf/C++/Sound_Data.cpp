#include <Sound_Data.h>

#include <fstream>
#include <cstring>

#include <al.h>

using namespace LSound;


Sound_Data::Sound_Data()
{

}

Sound_Data::~Sound_Data()
{
    delete m_raw_sound_data.data;
}



bool Sound_Data::is_stereo() const
{
    L_ASSERT(m_raw_sound_data.data);

    return m_raw_sound_data.format == AL_FORMAT_STEREO8 || m_raw_sound_data.format == AL_FORMAT_STEREO16;
}





Raw_Sound_Data load_wav(const std::string& filename)    //  this function is Composed with basic coding tools
{
    std::ifstream file(filename, std::ios::binary);
    L_ASSERT(file.is_open());

    char type[4];
    file.read(type, 4);
    L_ASSERT(strncmp(type, "RIFF", 4) == 0);

    Raw_Sound_Data result;

    file.seekg(22);
    short channels;
    file.read(reinterpret_cast<char*>(&channels), sizeof(short));

    file.seekg(24);
    file.read(reinterpret_cast<char*>(&result.frequency), sizeof(int));

    file.seekg(34);
    short bitsPerSample;
    file.read(reinterpret_cast<char*>(&bitsPerSample), sizeof(short));

    if (channels == 1) {
        result.format = (bitsPerSample == 8) ? AL_FORMAT_MONO8 : AL_FORMAT_MONO16;
    } else {
        result.format = (bitsPerSample == 8) ? AL_FORMAT_STEREO8 : AL_FORMAT_STEREO16;
    }

    file.seekg(40);
    int dataSize;
    file.read(reinterpret_cast<char*>(&dataSize), sizeof(int));

    result.size = dataSize;
    result.data = new char[dataSize];
    file.read(result.data, dataSize);

    file.close();

    return result;
}



BUILDER_STUB_DEFAULT_CONSTRUCTION_FUNC(Sound_Data_Stub)

BUILDER_STUB_INITIALIZATION_FUNC(Sound_Data_Stub)
{
    BUILDER_STUB_PARENT_INITIALIZATION;
    BUILDER_STUB_CAST_PRODUCT;

    L_ASSERT(sound_file_path.size() > 0);

    Raw_Sound_Data raw_sound_data;

    if(sound_file_path.size() > 4 && sound_file_path.substr(sound_file_path.size() - 4) == ".wav")
        raw_sound_data = load_wav(sound_file_path);

    L_ASSERT(raw_sound_data.data);  //  format is not supported (yet)

    product->set_raw_data(raw_sound_data);
}
