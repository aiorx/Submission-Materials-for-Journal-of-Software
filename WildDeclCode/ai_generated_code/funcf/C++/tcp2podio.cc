//.........................................................................
// The following was mostly Assisted with basic coding tools from a detailed prompt.
class CommandLineOptions {
public:
    std::string inputFilename;
    std::string outfile;
    int port = DEFAULT_ZMQ_PORT; // Default
    int groupevents = 50;
    bool loop = false;
    double rate = 0.0; // Unset
    std::string sqliteFilename;      // SQL file parameter
    std::string ipAddress = "localhost";

    static CommandLineOptions Parse(int argc, char* argv[]) {
        CommandLineOptions options;
        for (int i = 1; i < argc; ++i) {
            std::string arg = argv[i];
            if (arg == "-h" || arg == "--help") {
                PrintUsage();
                exit(0);
            } else if (arg == "-p" || arg == "--port") {
                if (i + 1 < argc) {
                    options.port = std::stoi(argv[++i]);
                }
            } else if (arg == "-i" || arg == "--ip-address") {
                if (i + 1 < argc) {
                    options.ipAddress = argv[++i];
                }
            } else if (arg == "-s" || arg == "--sqlfile") {
                if (i + 1 < argc) {
                    options.sqliteFilename = argv[++i];
                }
            }
        }

        return options;
    }

    static void PrintUsage() {
        std::cout << "\n" 
                  << "Usage: tcp2podio [-p port]\n"
                  << "\n"
                  << "-h, --help   Print this help statement\n"
                  << "-i, --ip-address <ip> Set the local IP address ZMQ to listen (default is 'localhost')\n"
                  << "-p, --port <port> Set ZMQ port to listen on (default is 55577)\n"
                  << "-s, --sqlfile <file> Specify the SQL rate logger file\n"
                  << "\n"
                  << "This is used to listen for events coming from an instance of podio2tcp\n."
                  << "It is only for testing the rate at which data is transferred and unmarshalled\n"
                  << "into TTrees. The data is discarded after that."
                  << "\n"
                  << "If --sqlfile is used, it specifies the SQLite database output.\n"
                  << "\n";
    }
};