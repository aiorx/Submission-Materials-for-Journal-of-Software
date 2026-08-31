// Direct include
// C system headers
// C++ standard library headers
// Other libraries' .h files.
#include <gtest/gtest.h>
// Your project's .h files.
#include "verilog/dtype/vint_detail.h"
using namespace std;
using namespace verilog::detail;

TEST(vint_detail, SanitizeStringInteger_) {
	// Testcases Assisted with basic coding tools
	EXPECT_EQ(SanitizeStringInteger_("-abc"), "-abc");
	EXPECT_EQ(SanitizeStringInteger_("--abc"), "-abc");
	EXPECT_EQ(SanitizeStringInteger_("---abc123"), "-abc123");
	EXPECT_EQ(SanitizeStringInteger_("!@#-abc"), "-abc");
	EXPECT_EQ(SanitizeStringInteger_("-1a2b3c"), "-1a2b3c");
	EXPECT_EQ(SanitizeStringInteger_("!!!"), "");
	EXPECT_EQ(SanitizeStringInteger_("-"), "-");
	EXPECT_EQ(SanitizeStringInteger_("   - "), "-");
	EXPECT_EQ(SanitizeStringInteger_("abc123"), "abc123");
	EXPECT_EQ(SanitizeStringInteger_("XYZ789"), "XYZ789");
	EXPECT_EQ(SanitizeStringInteger_("0A1b2C3"), "0A1b2C3");
	EXPECT_EQ(SanitizeStringInteger_("!@a#b$c%"), "abc");
	EXPECT_EQ(SanitizeStringInteger_("!!--hello--123!!"), "-hello123");
	EXPECT_EQ(SanitizeStringInteger_("**-A-B-C-**"), "-ABC");
	EXPECT_EQ(SanitizeStringInteger_(""), "");
	EXPECT_EQ(SanitizeStringInteger_("-"), "-");
	EXPECT_EQ(SanitizeStringInteger_("-!"), "-");
	EXPECT_EQ(SanitizeStringInteger_("--a"), "-a");
	EXPECT_EQ(SanitizeStringInteger_("-abc-"), "-abc");
	EXPECT_EQ(SanitizeStringInteger_("---"), "-");
}

TEST(vint_detail, ParseStringAsU64_handcraft) {
	uint64_t buf[10];

	// +-123
	ParseStringAsU64(buf, 16, 10, "123");
	EXPECT_EQ(buf[0], 123llu);

	ParseStringAsU64(buf, 16, 10, "-123");
	EXPECT_EQ(buf[0], -123llu);

	// +-0
	ParseStringAsU64(buf, 100, 10, "0");
	EXPECT_EQ(buf[0], 0llu);
	EXPECT_EQ(buf[1], 0llu);

	ParseStringAsU64(buf, 100, 10, "-0");
	EXPECT_EQ(buf[0], 0llu);
	EXPECT_EQ(buf[1], 0llu);

	ParseStringAsU64(buf, 16, 10, "0");
	EXPECT_EQ(buf[0], 0llu);

	ParseStringAsU64(buf, 16, 10, "-0");
	EXPECT_EQ(buf[0], 0llu);

	// +-1
	ParseStringAsU64(buf, 16, 10, "1");
	EXPECT_EQ(buf[0], 1llu);

	ParseStringAsU64(buf, 16, 10, "-1");
	EXPECT_EQ(buf[0], -1llu);

	ParseStringAsU64(buf, 100, 10, "1");
	EXPECT_EQ(buf[0], 1llu);
	EXPECT_EQ(buf[1], 0llu);

	ParseStringAsU64(buf, 100, 10, "-1");
	EXPECT_EQ(buf[0], -1llu);
	EXPECT_EQ(buf[1], -1llu);

	// INT_MIN
	ParseStringAsU64(buf, 3, 2, "-100");
	EXPECT_EQ(buf[0], 0xffff'ffff'ffff'fffcllu);

	ParseStringAsU64(buf, 63, 16, "-4000 0000 0000 0000");
	EXPECT_EQ(buf[0], 0xc000'0000'0000'0000llu);

	ParseStringAsU64(buf, 64, 16, "-8000 0000 0000 0000");
	EXPECT_EQ(buf[0], 0x8000'0000'0000'0000llu);

	ParseStringAsU64(buf, 68, 16, "-8 0000 0000 0000 0000");
	EXPECT_EQ(buf[0], 0llu);
	EXPECT_EQ(buf[1], -8llu);

	// the other
	ParseStringAsU64(buf, 16, 16, "3fff");
	EXPECT_EQ(buf[0], 0x3fffllu);

	ParseStringAsU64(buf, 16, 16, "-3fff");
	EXPECT_EQ(buf[0], -0x3fffllu);

	ParseStringAsU64(buf, 16, 16, "-4000");
	EXPECT_EQ(buf[0], -0x4000llu);

	ParseStringAsU64(buf, 16, 16, "f0f0");
	EXPECT_EQ(buf[0], 0xf0f0llu);
}

TEST(vint_detail, ParseStringAsU64_long_positive) {
	uint64_t buf[10];
	// Generate programmatically by ChatGPT
	ParseStringAsU64(buf, 10, 10, "437");
	EXPECT_EQ(buf[0], 437llu);
	ParseStringAsU64(buf, 63, 10, "7639628298369488768");
	EXPECT_EQ(buf[0], 7639628298369488768llu);
	ParseStringAsU64(buf, 64, 10, "7546191418317461228");
	EXPECT_EQ(buf[0], 7546191418317461228llu);
	ParseStringAsU64(buf, 65, 10, "20382578564365998291");
	EXPECT_EQ(buf[0], 1935834490656446675llu);
	EXPECT_EQ(buf[1], 1llu);
	ParseStringAsU64(buf, 127, 10, "144558223372103739907144252870378169295");
	EXPECT_EQ(buf[0], 14798936003240567759llu);
	EXPECT_EQ(buf[1], 7836516991533984871llu);
	ParseStringAsU64(buf, 128, 10, "196928118823300957890315698191862338284");
	EXPECT_EQ(buf[0], 3523292490767012588llu);
	EXPECT_EQ(buf[1], 10675494712585322881llu);
	ParseStringAsU64(buf, 129, 10, "61690009087049201571339320085608934165");
	EXPECT_EQ(buf[0], 216146475448281877llu);
	EXPECT_EQ(buf[1], 3344222093641462718llu);
	EXPECT_EQ(buf[2], 0llu);
	ParseStringAsU64(buf, 150, 10, "441682411789700047058182574444558869907916524");
	EXPECT_EQ(buf[0], 15702719822919124716llu);
	EXPECT_EQ(buf[1], 17520549458606402446llu);
	EXPECT_EQ(buf[2], 1297987llu);
	ParseStringAsU64(buf, 191, 10, "1169669960627848591505675720790613487898176116194289237404");
	EXPECT_EQ(buf[0], 15105457511185366428llu);
	EXPECT_EQ(buf[1], 11111562459027031884llu);
	EXPECT_EQ(buf[2], 3437351077611408672llu);
	ParseStringAsU64(buf, 192, 10, "2417505023576892100166872887273668819621754524323165419595");
	EXPECT_EQ(buf[0], 3098768787636140107llu);
	EXPECT_EQ(buf[1], 2063148848304709094llu);
	EXPECT_EQ(buf[2], 7104408745747844089llu);
}

TEST(vint_detail, ParseStringAsU64_long_negative) {
	uint64_t buf[10];
	// Generate programmatically by ChatGPT
	ParseStringAsU64(buf, 10, 10, "-260");
	EXPECT_EQ(buf[0], 0xfffffffffffffefcllu);
	ParseStringAsU64(buf, 63, 10, "-4067929767609326986");
	EXPECT_EQ(buf[0], 0xc78bcf6dde68a276llu);
	ParseStringAsU64(buf, 64, 10, "-5176111614422507603");
	EXPECT_EQ(buf[0], 0xb82ac1e930929fadllu);
	ParseStringAsU64(buf, 65, 10, "-16524317261711478725");
	EXPECT_EQ(buf[0], 0x1aadd50003d4f03bllu);
	EXPECT_EQ(buf[1], 0xffffffffffffffffllu);
	ParseStringAsU64(buf, 127, 10, "-5819237944956647590662913550200233405");
	EXPECT_EQ(buf[0], 0x93c2d45a00ada243llu);
	EXPECT_EQ(buf[1], 0xfb9f416afe22f034llu);
	ParseStringAsU64(buf, 128, 10, "-74688922710725927093612389042492588344");
	EXPECT_EQ(buf[0], 0xe023395382f3ec8llu);
	EXPECT_EQ(buf[1], 0xc7cf6fcd207ffcc6llu);
	ParseStringAsU64(buf, 129, 10, "-305683759440800103320324794597584516015");
	EXPECT_EQ(buf[0], 0x7c3437535aa24c51llu);
	EXPECT_EQ(buf[1], 0x1a07730d0f069d31llu);
	EXPECT_EQ(buf[2], 0xffffffffffffffffllu);
	ParseStringAsU64(buf, 150, 10, "-422077589887748602860685196785978526596493507");
	EXPECT_EQ(buf[0], 0x5a205ec57a718f3dllu);
	EXPECT_EQ(buf[1], 0x719609fa89809a96llu);
	EXPECT_EQ(buf[2], 0xffffffffffed12c9llu);
	ParseStringAsU64(buf, 191, 10, "-298831081963468557514104821011593750810357178015263482321");
	EXPECT_EQ(buf[0], 0x98936a5bca7c1e2fllu);
	EXPECT_EQ(buf[1], 0x5ed578a09490cedbllu);
	EXPECT_EQ(buf[2], 0xf3d00ed471022ccellu);
	ParseStringAsU64(buf, 192, 10, "-188715424522621122843783093777760611900181703176317978042");
	EXPECT_EQ(buf[0], 0x9f6094604d91ba46llu);
	EXPECT_EQ(buf[1], 0xe6b9bfe57aefe37fllu);
	EXPECT_EQ(buf[2], 0xf84db812b5c1716cllu);
}
