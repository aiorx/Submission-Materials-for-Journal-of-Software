//
//  ofxBitmapConsole.h
//
//  Created by 2bit on 2025/02/14.
//

#ifndef ofxBitmapConsole_h
#define ofxBitmapConsole_h

#include "ofUtils.h"

#include <algorithm>
#include <regex>

namespace ofx {
    struct BitmapConsole {
        struct Settings {
            Settings()
            : max_lines{0}
            , num_fold{0}
            , is_reversed{false}
            {};
            
            Settings(const Settings &) = default;
            Settings(Settings &&) = default;
            Settings &operator=(const Settings &) = default;
            Settings &operator=(Settings &&) = default;
            
            std::size_t max_lines{0};
            std::size_t num_fold{0};
            bool is_reversed{false};
            
            Settings &maxLines(std::size_t max_lines) {
                this->max_lines = max_lines;
                return *this;
            }
            Settings &numFold(std::size_t num_fold) {
                this->num_fold = num_fold;
                return *this;
            }
            Settings &reverse(bool is_reversed) {
                this->is_reversed = is_reversed;
                return *this;
            }
        };
        
        struct Line {
            Line(const std::string &text)
            : text{text}
            , num_lines{count_lines(text)}
            {};
            
            Line(const std::string &text, bool highlighted)
            : text{text}
            , num_lines{count_lines(text)}
            , highlighted{highlighted}
            {};
            
            Line(const std::string &text, ofColor bg, ofColor fg)
            : text{text}
            , num_lines{count_lines(text)}
            , highlighted{true}
            , bg_color{bg}
            , fg_color{fg}
            {};
            
            static std::size_t count_lines(const std::string &text) {
                return std::count(text.begin(), text.end(), '\n') + 1;
            }
            
            std::string text;
            std::size_t num_lines;
            bool highlighted{false};
            ofColor bg_color{};
            ofColor fg_color{};
        };
        
        void setup(Settings settings = Settings()) {
            this->settings = settings;
        }
        
        void clear() {
            lines.clear();
        }
        
        void add(const std::string &text) {
            lines.emplace_back(fold(text));
            calc_max();
        }
        
        void add(Line &&line) {
            lines.emplace_back(fold(line));
            calc_max();
        }
        void add(const Line &line) {
            lines.emplace_back(line);
            calc_max();
        }
        
        void addHighlight(const std::string &text,
                          ofColor background = ofColor::black,
                          ofColor foreground = ofColor::white)
        {
            lines.emplace_back(fold(text), background, foreground);
            calc_max();
        }
        
        void draw() const
        { draw(0.0f, 0.0f); }
        
        float draw(float x, float y) const {
            std::size_t num_line_drawn = 1;
            if(settings.is_reversed) {
                for(auto it = lines.rbegin(); it != lines.rend(); ++it) {
                    const auto &line = *it;
                    if(ofGetHeight() < y + 20 * num_line_drawn + 20 * line.num_lines) {
                        break;
                    }
                    if(line.highlighted) {
                        ofDrawBitmapStringHighlight(line.text, x + 20, y + 20 * num_line_drawn, line.bg_color, line.fg_color);
                    } else {
                        ofDrawBitmapString(line.text, x + 20, y + 20 * num_line_drawn);
                    }
                    num_line_drawn += line.num_lines;
                }
            } else {
                for(const auto &line : lines) {
                    if(ofGetHeight() < y + 20 * num_line_drawn + 20 * line.num_lines) {
                        break;
                    }
                    if(line.highlighted) {
                        ofDrawBitmapStringHighlight(line.text, x + 20, y + 20 * num_line_drawn, line.bg_color, line.fg_color);
                    } else {
                        ofDrawBitmapString(line.text, x + 20, y + 20 * num_line_drawn);
                    }
                    num_line_drawn += line.num_lines;
                }
            }
            return y + 20 * num_line_drawn;
        }
        
        struct quasi_ostream {
            quasi_ostream() = delete;
            quasi_ostream(const quasi_ostream &mom)
            : console{mom.console}
            , line{mom.line}
            , os{mom.os.str()}
            {};
            quasi_ostream(quasi_ostream &&) = default;
            quasi_ostream(BitmapConsole &console, Line &&line)
            : console{console}
            , line{std::move(line)}
            {};
            
            ~quasi_ostream() {
                line.text = os.str();
                console.add(std::move(line));
            };
            
            template <typename value_type>
            quasi_ostream &operator<<(const value_type &v) {
                os << v;
                return *this;
            }
            
            BitmapConsole &console;
            Line line;
            std::ostringstream os{""};
        };
        
        quasi_ostream highligted(ofColor bg_color = ofColor::black,
                                 ofColor fg_color = ofColor::white)
        {
            return quasi_ostream{*this, Line{"", bg_color, fg_color}};
        }
        
        using ostream_manip_t = std::ostream &(*)(std::ostream &);
        BitmapConsole &operator<<(ostream_manip_t manip) {
            if(manip == static_cast<ostream_manip_t>(std::endl)) {
                add("");
            } else {
                ofLogWarning() << "unknown manipulator was given";
            }
            return *this;
        }

        quasi_ostream operator<<(const std::string &text)
        { return quasi_ostream{*this, Line{""}} << text; }
        
    protected:
        std::vector<Line> lines{};
        Settings settings{};

        // basically, Supported via standard programming aids o3-mini-high
        std::string fold(const std::string &input) {
            if(settings.num_fold == 0) return input;
            std::regex r("\\s+");
            std::sregex_token_iterator it(input.begin(), input.end(), r, -1);
            std::sregex_token_iterator end;
            std::vector<std::string> words;
            for(; it != end; ++it) {
                if(it->str() != "") words.push_back(it->str());
            }
            
            std::vector<std::string> lines;
            std::string current;
            for(std::size_t i = 0; i < words.size(); ++i){
                std::string word = words[i];
                if(current == "") {
                    if(word.size() <= settings.num_fold){
                        current = word;
                    }
                    else {
                        for(std::size_t j = 0; j < word.size(); j += settings.num_fold) {
                            lines.push_back(word.substr(j, settings.num_fold));
                        }
                        current = "";
                    }
                } else {
                    std::string candidate = current + " " + word;
                    if(candidate.size() <= settings.num_fold) {
                        current = candidate;
                    } else {
                        lines.push_back(current);
                        if(word.size() <= settings.num_fold) {
                            current = word;
                        } else {
                            for(std::size_t j = 0; j < word.size(); j += settings.num_fold) {
                                lines.push_back(word.substr(j, settings.num_fold));
                            }
                            current = "";
                        }
                    }
                }
            }
            if(current != "") lines.push_back(current);
            for(std::size_t i = 1; i < lines.size(); ++i) {
                if(!lines[i].empty() && (lines[i][0] == '.' || lines[i][0] == ',' || lines[i][0] == '-')) {
                    char c = lines[i][0];
                    lines[i].erase(0, 1);
                    lines[i - 1] += c;
                }
            }
            
            std::string result;
            for(std::size_t i = 0; i < lines.size(); ++i) {
                result += lines[i];
                if(i < lines.size() - 1) result += "\n";
            }
            return result;
        }

        Line fold(const Line &line) {
            Line new_line = line;
            new_line.text = fold(line.text);
            new_line.num_lines = Line::count_lines(new_line.text);
            return new_line;
        }

        void calc_max() {
            if(settings.max_lines == 0) return;
            auto num_lines = std::accumulate(lines.begin(), lines.end(), 0, [](std::size_t sum, const Line &line) {
                return sum + line.num_lines;
            });
            while(!lines.empty() && settings.max_lines < num_lines) {
                num_lines -= lines.front().num_lines;
                lines.erase(lines.begin());
            }
        }
    };
};

using ofxBitmapConsole = ofx::BitmapConsole;

#endif /* ofxBitmapConsole_h */
