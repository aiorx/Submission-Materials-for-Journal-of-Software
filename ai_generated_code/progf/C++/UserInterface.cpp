#include "UserInterface.h"
#include "ResourceManager.h"
#include <string>
#include <iostream>
#include <imgui/imgui_internal.h>

UserInterface* UserInterface::ui_Instance = nullptr;

void UserInterface::Start(std::string const& pathFonts, std::string const& titleFont, std::string const& gameFont, std::string const& menuFont)
{

	const char* glsl_version = "#version 100";  //310/320es not available
	ImGui::CreateContext();
	ImGui::StyleColorsDark();
	ImGui_ImplOpenGL3_Init(glsl_version);
	ImGuiIO& io = ImGui::GetIO();
	io.DisplaySize = ImVec2(WINDOW_WIDTH, WINDOW_HEIGHT);

	std::string prefix;

#ifdef WINDOWS_BUILD
	prefix = "";
#endif

#ifdef Raspberry_BUILD
	prefix = "../";
#endif

	std::string finalPathTitleFont = prefix + pathFonts + "/" + titleFont;
	std::string finalPathGameFont = prefix + pathFonts + "/" + gameFont;
	std::string finalPathMenuFont = prefix + pathFonts + "/" + menuFont;

	fontTitle = io.Fonts->AddFontFromFileTTF(finalPathTitleFont.c_str(), 24.0f);
	fontGame = io.Fonts->AddFontFromFileTTF(finalPathGameFont.c_str(), 24.0f);
	fontMenu = io.Fonts->AddFontFromFileTTF(finalPathMenuFont.c_str(), 24.0f);
}

void UserInterface::Init()
{
	ImGui_ImplOpenGL3_NewFrame();
	ImGui::NewFrame();
}

void UserInterface::EngineTools(Transform* desiredTransform)
{
	ImGui::SetNextWindowSize(ImVec2(350, 350), open);
	ImGui::Begin("Transform", &open, Transform_flags);

	/*ImGui::Text("Position: ");
	ImGui::SetNextItemWidth(80); ImGui::SliderFloat("##px", &desiredTransform->position.x, -10.0f, 10.0f, "%.1f"); ImGui::SameLine();
	ImGui::SetNextItemWidth(80); ImGui::SliderFloat("##py", &desiredTransform->position.y, -10.0f, 10.0f, "%.1f"); ImGui::SameLine();
	ImGui::SetNextItemWidth(80); ImGui::SliderFloat("##pz", &desiredTransform->position.z, -10.0f, 10.0f, "%.1f");*/

	ImGui::Dummy(ImVec2(0.0f, 10.0f));
	ImGui::Text("Rotation: ");
	ImGui::SetNextItemWidth(80); ImGui::SliderFloat("##rx", &desiredTransform->rotation.x, -360.0f, 360.0f, "%.1f"); ImGui::SameLine();
	ImGui::SetNextItemWidth(80); ImGui::SliderFloat("##ry", &desiredTransform->rotation.y, -360.0f, 360.0f, "%.1f"); ImGui::SameLine();
	ImGui::SetNextItemWidth(80); ImGui::SliderFloat("##rz", &desiredTransform->rotation.z, -360.0f, 360.0f, "%.1f");

	ImGui::Dummy(ImVec2(0.0f, 10.0f));
	ImGui::Text("Scale: ");
	ImGui::SetNextItemWidth(80); ImGui::SliderFloat("##sx", &desiredTransform->scale.x, 0.1f, 10.0f, "%.1f"); ImGui::SameLine();
	ImGui::SetNextItemWidth(80); ImGui::SliderFloat("##sy", &desiredTransform->scale.y, 0.1f, 10.0f, "%.1f"); ImGui::SameLine();
	ImGui::SetNextItemWidth(80); ImGui::SliderFloat("##sz", &desiredTransform->scale.z, 0.1f, 10.0f, "%.1f");

	ImGui::End();

}

void UserInterface::MainMenu(bool& isIntro, bool& isLoading, bool& isRunning)
{
	ImGui::PushFont(fontTitle);
	ImGui::SetNextWindowPos(ImVec2(WINDOW_WIDTH / 2 - 80, 100));
	ImGui::SetNextWindowSize(ImVec2(300, 60), open);
	ImGui::Begin("TITLE", &open, HUD_flags);
	ImGui::Text("PI Gear Solid");
	ImGui::PopFont();
	ImGui::PushFont(fontMenu);
	ImGui::Text("made by Iancic David");
	ImGui::End();
	ImGui::PopFont();

	ImGui::PushFont(fontMenu);
	ImGui::SetNextWindowPos(buttonPosition4);
	ImGui::SetNextWindowSize(buttonSize, open);
	ImGui::Begin("Start", &open, HUD_flags);
	if (ImGui::Button("START"))
	{
		isIntro = false;
		isLoading = true;
	}
	ImGui::End();

	ImGui::SetNextWindowPos(buttonPosition3);
	ImGui::SetNextWindowSize(buttonSize, open);
	ImGui::Begin("Exit Game", &open, HUD_flags);
	if (ImGui::Button("EXIT"))
	{
		isRunning = false;
	}
	ImGui::End();
	ImGui::PopFont();
}

void UserInterface::LoadingScreen(bool& isIntro, bool& isRunning, float& loaded)
{
	(void)isIntro; // Unreferenced Parameter
	(void)isRunning; // Unreferenced Parameter

	float loadedPercentage = loaded / 5.0f;  // Assuming loaded is between 0 and 5

	ImGui::PushFont(fontMenu);
	ImGui::SetNextWindowPos(ImVec2(WINDOW_WIDTH / 2 - 80, 85));
	ImGui::SetNextWindowSize(ImVec2(500, 60), open);
	ImGui::Begin("TITLE", &open, HUD_flags);
	ImGui::Text(ResourceManager::getInstance()->loadingMessage.c_str());
	ImGui::End();

	ImGui::SetNextWindowPos(ImVec2(140, 120));
	ImGui::SetNextWindowSize(ImVec2(800, 400), open);
	ImGui::Begin("Cloack", &open, HUD_flags);
	ImGui::PushStyleColor(ImGuiCol_PlotHistogram, ImVec4(0.0f, 1.0f, 0.0f, 1.0f));

	// ProgressBar
	ImGui::ProgressBar(loadedPercentage, ImVec2(800, barHeight), "");

	// Place the percentage text inside the progress bar
	ImVec2 cursorPos = ImGui::GetCursorPos(); // Save the current cursor position
	ImGui::SetCursorPos(ImVec2(cursorPos.x + (600 * loadedPercentage) - 50, cursorPos.y + barHeight / 2 - 10)); // Adjust to center text inside bar
	ImGui::Text("", loadedPercentage * 100.0f);

	ImGui::PopStyleColor();
	ImGui::End();
	ImGui::PopFont();

	ImGui::PushFont(fontMenu);
	ImGui::SetNextWindowPos(ImVec2(WINDOW_WIDTH / 2 - 250, WINDOW_HEIGHT / 2));
	ImGui::SetNextWindowSize(ImVec2(800, 800), open);
	ImGui::Begin("TutorialTab", &open, HUD_flags);
	ImGui::Text("Controls:");
	ImGui::Text("Q: Inventory");
	ImGui::Text("1 2 3 4: Select Item");
	ImGui::Text("E: Use Selected Item");
	ImGui::Text("");
	ImGui::Text("Tips:");
	ImGui::Text("Escape with the Metal Gear's blueprints.");
	ImGui::Text("Enemies don't detect you when invisible.");
	ImGui::Text("Good Luck Soldier!");
	ImGui::End();
	ImGui::PopFont();

}

void UserInterface::PauseMenu(bool& isPause, bool& isDebug, bool& isRunning, bool& isIntro, bool& isTools)
{
	ImGui::PushFont(fontMenu);
	ImGui::SetNextWindowPos(buttonPosition5);
	ImGui::SetNextWindowSize(buttonSize, open);
	ImGui::Begin("Resume", &open, HUD_flags);
		if (ImGui::Button("RESUME"))
		{
			isPause = false;
		}
	ImGui::End();

	ImGui::SetNextWindowPos(buttonPosition4);
	ImGui::SetNextWindowSize(buttonSize, open);
	ImGui::Begin("Debug", &open, HUD_flags);
	if(!isDebug)
	{
		if (ImGui::Button("ENABLE DEBUG"))
		{
			if (isDebug)
				isDebug = false;
			else
				isDebug = true;

			isPause = false;
		}
	}
	else
	{
		if (ImGui::Button("DISABLE DEBUG"))
		{
			if (isDebug)
				isDebug = false;
			else
				isDebug = true;

			isPause = false;
		}
	}
	ImGui::End();

	ImGui::SetNextWindowPos(buttonPosition3);
	ImGui::SetNextWindowSize(buttonSize, open);
	ImGui::Begin("Tools", &open, HUD_flags);
	if (!isTools)
	{
		if (ImGui::Button("ENABLE TOOLS"))
		{
			if (isTools)
				isTools = false;
			else
				isTools = true;

			isPause = false;
		}
	}
	else
	{
		if (ImGui::Button("DISABLE TOOLS"))
		{
			if (isTools)
				isTools = false;
			else
				isTools = true;

			isPause = false;
		}
	}
	ImGui::End();

	ImGui::SetNextWindowPos(buttonPosition2);
	ImGui::SetNextWindowSize(buttonSize, open);
	ImGui::Begin("Exit To Main Menu", &open, HUD_flags);
		if (ImGui::Button("MAIN MENU"))
		{
			isIntro = true;
			isPause = false;
		}
	ImGui::End();

	ImGui::SetNextWindowPos(buttonPosition1);
	ImGui::SetNextWindowSize(buttonSize, open);
	ImGui::Begin("Exit Game", &open, HUD_flags);
		if (ImGui::Button("EXIT GAME"))
		{
			isRunning = false;
		}
	ImGui::End();
	ImGui::PopFont();
}

void UserInterface::WinMenu(bool& isRunning)
{
	ImGui::PushFont(fontMenu);
	ImGui::SetNextWindowPos(ImVec2(WINDOW_WIDTH / 2 - 80, 100));
	ImGui::SetNextWindowSize(ImVec2(300, 60), open);
	ImGui::Begin("Win Title", &open, HUD_flags);
	ImGui::Text("You Won");
	ImGui::Text("Escaped The Base");
	ImGui::End();

	ImGui::SetNextWindowPos(buttonPosition1);
	ImGui::SetNextWindowSize(buttonSize, open);
	ImGui::Begin("Exit Game Win", &open, HUD_flags);
	if (ImGui::Button("Exit Game"))
	{
		isRunning = false;
	}
	ImGui::End();

	//ImGui::SetNextWindowPos(buttonPosition2);
	//ImGui::SetNextWindowSize(buttonSize, open);
	//ImGui::Begin("PlayAgain", &open, HUD_flags);
	//if (ImGui::Button("Play Again"))
	//{
	//	// TO DO: ADD LOGIC
	//	//isRunning = false;
	//}
	//ImGui::End();

	ImGui::PopFont();
}

void UserInterface::DeathMenu(bool& isRunning)
{
	ImGui::PushFont(fontMenu);
	ImGui::SetNextWindowPos(ImVec2(WINDOW_WIDTH / 2 - 80, 100));
	ImGui::SetNextWindowSize(ImVec2(400, 200), open);
	ImGui::Begin("Lost Title", &open, HUD_flags);

	ImGui::Text("You got Shot Down");
	ImGui::Text("THE END");

	ImGui::End();

	ImGui::SetNextWindowPos(buttonPosition1);
	ImGui::SetNextWindowSize(buttonSize, open);
	ImGui::Begin("Exit Game Lost", &open, HUD_flags);
	if (ImGui::Button("Exit Game"))
	{
		isRunning = false;
	}
	ImGui::End();

	
	//ImGui::SetNextWindowPos(buttonPosition2);
	//ImGui::SetNextWindowSize(buttonSize, open);
	//ImGui::Begin("Restart", &open, HUD_flags);
	//if (ImGui::Button("Restart"))
	//{
	//	// TO DO: ADD LOGIC
	//	//isRunning = false;
	//}
	//ImGui::End();

	ImGui::PopFont();
}

void UserInterface::HUD(float& HP, float& Cloack)
{
	if (!isInventory)
	{
		float healthPercent = HP / 100;

		ImGui::PushFont(fontMenu);
		ImGui::SetNextWindowPos(ImVec2(110, 40));
		ImGui::SetNextWindowSize(ImVec2(800, 200), open);
		ImGui::Begin("HP", &open, HUD_flags);
		ImGui::PushStyleColor(ImGuiCol_PlotHistogram, ImVec4(1.0f, 0.0f, 0.0f, 1.0f));
		ImGui::ProgressBar(healthPercent, ImVec2(barWidth, barHeight), "Health");
		ImGui::PopStyleColor();
		ImGui::End();

		ImGui::SetNextWindowPos(ImVec2(110, 120));
		ImGui::SetNextWindowSize(ImVec2(800, 200), open);
		ImGui::Begin("Cloack", &open, HUD_flags);
		ImGui::PushStyleColor(ImGuiCol_PlotHistogram, ImVec4(0.0f, 1.0f, 0.0f, 1.0f));
		ImGui::ProgressBar(Cloack, ImVec2(barWidth, barHeight), "Invisibility");
		ImGui::PopStyleColor();
		ImGui::End();
		ImGui::PopFont();


		ImGui::SetNextWindowPos(ImVec2(15, 200));
		ImGui::SetNextWindowSize(ImVec2(600, 600), open);
		ImGui::Begin("Escape Inventory", &open, HUD_flags);
		ImGui::PushFont(fontTitle);
		ImGui::Text("E");
		ImGui::PopFont();
		ImGui::PushFont(fontMenu);
		ImGui::Text("Use Item");
		ImGui::PopFont();

		ImGui::End();
	}
	else
	{
		

		ImGui::SetNextWindowPos(ImVec2(50, 50));
		ImGui::SetNextWindowSize(ImVec2(600, 600), open);
		ImGui::Begin("Escape Inventory", &open, HUD_flags);
		ImGui::PushFont(fontTitle);
		ImGui::Text("Q");
		ImGui::PopFont();
		ImGui::PushFont(fontMenu);
		ImGui::Text("To Exit Inventory");
		ImGui::PopFont();

		ImGui::End();

		ImGui::SetNextWindowPos(ImVec2(WINDOW_WIDTH / 2 - 350, WINDOW_HEIGHT/2 + 200));
		ImGui::SetNextWindowSize(ImVec2(1100, 600), open);
		ImGui::Begin("Arrows", &open, HUD_flags);
		ImGui::PushFont(fontGame);
		ImGui::Text("1        2          3        4");
		ImGui::PopFont();
		ImGui::End();
	}
}

void UserInterface::TransparentPanel()
{
	// Set up the semi-transparent black background for the panel
	ImVec4 transparentBlack(0.0f, 0.0f, 0.0f, 0.8f);  // RGBA values for a dark, semi-transparent color

	// Push the color for the window's background (ImGuiCol_WindowBg)
	ImGui::PushStyleColor(ImGuiCol_WindowBg, transparentBlack);

	// Start a new window, with the size being the same as the screen/window
	ImGui::SetNextWindowPos(ImVec2(0, 0));  // Position it at the top-left corner
	ImGui::SetNextWindowSize(ImVec2(WINDOW_WIDTH, WINDOW_HEIGHT));  // Match the full window size
	ImGui::Begin("Transparent Panel", nullptr, ImGuiWindowFlags_NoTitleBar | ImGuiWindowFlags_NoResize | ImGuiWindowFlags_NoMove);

	// You can add other widgets as needed

	ImGui::End();  // End the window

	// Pop the style color to restore the previous style settings
	ImGui::PopStyleColor();
}

void UserInterface::Shutdown()
{
	ImGui::Render();
	ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
}

void UserInterface::Style()
{
	// Style Aided using common development resources
	// Considering it's just a debbuging visual AI is the best at this.
	ImGuiStyle& style = ImGui::GetStyle();
	ImVec4* colors = style.Colors;

	ImGuiIO& io = ImGui::GetIO();
	
	io.FontGlobalScale = 1.2f; // Increase the scale globally (1.0f is the default).

	// TO DO: DO SOMETHING REGARDING BUTTON HOVE SO IT'S SUPER VISIBLE
	colors[ImGuiCol_Text] = ImVec4(0.90f, 0.90f, 0.90f, 1.00f);
	colors[ImGuiCol_WindowBg] = ImVec4(0.05f, 0.05f, 0.05f, 1.00f);
	colors[ImGuiCol_Header] = ImVec4(0.15f, 0.15f, 0.15f, 1.00f);
	colors[ImGuiCol_HeaderHovered] = ImVec4(0.20f, 0.20f, 0.20f, 1.00f);
	colors[ImGuiCol_HeaderActive] = ImVec4(0.25f, 0.25f, 0.25f, 1.00f);

	colors[ImGuiCol_Button] = ImVec4(0.20f, 0.20f, 0.20f, 1.00f);
	colors[ImGuiCol_ButtonHovered] = ImVec4(0.3f, 0.8f, 0.3f, 1.00f);
	colors[ImGuiCol_ButtonActive] = ImVec4(0.40f, 0.40f, 0.40f, 1.00f);

	colors[ImGuiCol_FrameBg] = ImVec4(0.10f, 0.10f, 0.10f, 1.00f);
	colors[ImGuiCol_FrameBgHovered] = ImVec4(0.15f, 0.15f, 0.15f, 1.00f);
	colors[ImGuiCol_FrameBgActive] = ImVec4(0.20f, 0.20f, 0.20f, 1.00f);

	colors[ImGuiCol_Border] = ImVec4(0.20f, 0.20f, 0.20f, 0.50f);
	colors[ImGuiCol_ScrollbarBg] = ImVec4(0.10f, 0.10f, 0.10f, 1.00f);
	colors[ImGuiCol_ScrollbarGrab] = ImVec4(0.20f, 0.20f, 0.20f, 1.00f);
	colors[ImGuiCol_ScrollbarGrabHovered] = ImVec4(0.30f, 0.30f, 0.30f, 1.00f);
	colors[ImGuiCol_ScrollbarGrabActive] = ImVec4(0.40f, 0.40f, 0.40f, 1.00f);

	colors[ImGuiCol_TitleBg] = ImVec4(0.10f, 0.10f, 0.10f, 1.00f);
	colors[ImGuiCol_TitleBgActive] = ImVec4(0.15f, 0.15f, 0.15f, 1.00f);
	colors[ImGuiCol_TitleBgCollapsed] = ImVec4(0.05f, 0.05f, 0.05f, 1.00f);

	colors[ImGuiCol_ResizeGrip] = ImVec4(0.15f, 0.15f, 0.15f, 1.00f);
	colors[ImGuiCol_ResizeGripHovered] = ImVec4(0.25f, 0.25f, 0.25f, 1.00f);
	colors[ImGuiCol_ResizeGripActive] = ImVec4(0.35f, 0.35f, 0.35f, 1.00f);
}