//     int opt;
//     while ((opt = getopt(argc, argv, "w:h:s:")) != -1) {
//         switch (opt) {
//             case 'w':
//                 width = std::stoi(optarg);
//                 break;
//             case 'h':
//                 height = std::stoi(optarg);
//                 break;
//             case 's': {
//                 std::string size(optarg);

//                 // Clean input (remove spaces)
//                 size.erase(remove(size.begin(), size.end(), ' '), size.end());

//                 // Ensure format is strictly "WxH"
//                 size_t x_pos = size.find('x');
//                 if (x_pos != std::string::npos && x_pos > 0 && x_pos < size.length() - 1) {
//                     width = std::stoi(size.substr(0, x_pos));
//                     height = std::stoi(size.substr(x_pos + 1));
//                 } else {
//                     std::cerr << "Invalid size format. Use -s WxH (e.g., -s 12x15)." << std::endl;
//                     return 1;
//                 }
//                 break;
//             }
//             default:
//                 std::cerr << "Usage: " << argv[0] << " [-w width] [-h height] [-s WxH]" << std::endl;
//                 return 1;
//         }
//     }