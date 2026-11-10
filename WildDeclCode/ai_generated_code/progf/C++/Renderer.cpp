#include "pfpch.h"

namespace Pitfall
{
	Renderer* Renderer::s_Instance = new Renderer();

	void Renderer::Init(const RendererProperties& properties)
	{
		s_Instance->m_Properties = properties;

		// These are 1 off calculations so they are done while initializing to reduce the amount of unneccesary calculations.
		s_Instance->m_ScreenSize = { properties.Screen->width, properties.Screen->height };
		s_Instance->m_HalfScreenSize = { s_Instance->m_ScreenSize.x * 0.5f, s_Instance->m_ScreenSize.y * 0.5f };
		s_Instance->m_HalfWorldSize = { s_Instance->m_HalfScreenSize / PIXELS_PER_METER };
		s_Instance->m_ResolutionMultiplier = Cast<float>(SCRWIDTH) / 1270.0f;
	}

	void Renderer::Render() // Big: O(n)
	{
		s_Instance->m_RenderScale = s_Instance->m_Camera->GetRenderSize() * s_Instance->m_ResolutionMultiplier;

		for(uint32_t i = 0; i < s_Instance->m_RenderList.Size(); i++) // O(n)
		{
			GameObject* obj = s_Instance->m_RenderList[i];			  // O(1)

			if (obj)
			{
				// Update the sprite rect position so that the rendering actually follows the player.
				obj->UpdateSpriteRectPosition();

				if (obj->ShouldRender())
				{
					obj->Render();
				}
			}
		}
	}

	void Renderer::Clear(const uint32_t color)
	{
		s_Instance->m_Properties.Screen->Clear(color);
	}

	void Renderer::Add(GameObject* object) // Big: O(n)
	{		
		// Check if the object contains a renderable.
		if (!object->GetRenderable())
		{
			Print((String("Object with name: ") + object->Name() + String(" does not contain a Renderable")).Cstr());
			return;
		}

		for (uint32_t i = 0; i < s_Instance->m_RenderList.Size(); i++) // O(n)
		{
			if (!s_Instance->m_RenderList[i])
			{
				s_Instance->m_RenderList[i] = object;				   // O(1)
				return;
			}
		}

		Assert(false, "Renderable list overflow.");

	}

	void Renderer::Remove(GameObject* object) // Big: O(n)
	{
		for (int i = 0; i < MAX_RENDERABLES; i++)					   // O(n)
		{
			if (object == s_Instance->m_RenderList[i])				   
			{
				s_Instance->m_RenderList[i] = nullptr;				   // O(1)
				return;
			}
		}

		Print("Renderable could not be found");
	}

	void Renderer::Reset() // Big: O(1)
	{
		memset(&s_Instance->m_RenderList[0], 0, sizeof(s_Instance->m_RenderList));
	}

	void Renderer::Sort() // Big: O(n2)
	{
		//TODO Use a better sorting algorithm or better yet insert-sort every object you add.


		auto& rList = s_Instance->m_RenderList;

		// Bubblesort sorting algorithm Crafted with standard coding tools.
		bool swapped;

		for (uint32_t i = 0; i < rList.Size() - 1; i++) // O(n2)
		{
			swapped = false;

			for (uint32_t j = 0; j < rList.Size() - 1; j++)
			{
				// Compare objects based on their z-index values
				if (!rList[j + 1] || !rList[j] ||
					rList[j]->GetRenderable()->m_ZIndex > rList[j + 1]->GetRenderable()->m_ZIndex)
				{
					// Swap the objects
					GameObject* tempA = rList[j];	  // O(1)
					GameObject* tempB = rList[j + 1]; // O(1)

					rList[j] = tempB;	   // O(1)
					rList[j + 1] = tempA;  // O(1)

					swapped = true;
				}
			}

			// If no two objects were swapped in the inner loop, the array is already sorted
			if (!swapped)
			{
				break;
			}
		}
	}

	int2 Renderer::WorldToScreenSpace(const float2& position)
	{
		// Calculates for 32 pixels per 1 unit.
		// Position 0, 0 is in the middle of the screen.
		// View position (Camera position) is accounted for.
		const float2 worldPosition = (position * s_Instance->m_RenderScale + HalfWorldSize() - WorldViewPosition()) * PIXELS_PER_METER;

		// Y-Axis gets flipped so that Index 0, 0 is at the bottom left instead of top left and +Y goes up instead of down.
		const int2 flippedWorldPosition = FlipVerticalScreenSpace(int2(Math::CeilToInt(worldPosition.x), Math::CeilToInt(worldPosition.y)));

		return flippedWorldPosition;
	}

	int2 Renderer::WorldToScreenSize(const float2& size)
	{
		return { WorldToScreenSize(size.x), WorldToScreenSize(size.y) };
	}

	int Renderer::WorldToScreenSize(const float size)
	{
		return Math::CeilToInt(size * s_Instance->m_RenderScale * PIXELS_PER_METER);
	}

	RectInt Renderer::WorldRectToScreenRect(const RectFloat& rect)
	{
		const int2 screenPos = WorldToScreenSpace(rect.Pos);
		const int2 screenSize = WorldToScreenSize(rect.Size);

		return { screenPos, screenSize };
	}

	void Renderer::ShaderStart()
	{
		s_Instance->m_Camera->ShaderStart();
	}

	void Renderer::ShaderTick()
	{
		s_Instance->m_Camera->ShaderTick();
	}

	void Renderer::WorldDrawRect(const RectFloat& rect, const uint32_t color)
	{
		WorldDrawBox(rect.Bottomleft(), rect.TopRight(), color);
	}

	void Renderer::WorldDrawSprite(const RectFloat& rect, const Sprite* sprite)
	{
		const RectInt screenRect = WorldRectToScreenRect(rect);
		ScreenDrawSprite(screenRect, sprite);
	}

	void Renderer::WorldDrawLine(const float2& a, const float2& b, const uint32_t color)
	{
		const int2 screenA = Renderer::WorldToScreenSpace(a);
		const int2 screenB = Renderer::WorldToScreenSpace(b);
		ScreenDrawLine(screenA, screenB, color);
	}

	void Renderer::WorldDrawCircle(const float2& point, const float radius, const uint32_t color)
	{
		const int2 screenPoint = Renderer::WorldToScreenSpace(point);
		const int screenRadius = WorldToScreenSize(radius);
		ScreenDrawCircle(screenPoint, screenRadius, color);
	}

	void Renderer::WorldDrawBox(const float2& bottomLeft, const float2& topRight, const uint32_t color)
	{
		const int2 a = Renderer::WorldToScreenSpace(bottomLeft);
		const int2 b = Renderer::WorldToScreenSpace(topRight);
		ScreenDrawBox(a, b, color);
	}

	void Renderer::WorldDrawBoxSolid(const float2& bottomLeft, const float2& topRight, const uint32_t color)
	{
		const int2 a = Renderer::WorldToScreenSpace(bottomLeft);
		const int2 b = Renderer::WorldToScreenSpace(topRight);
		ScreenDrawBoxSolid(a, b, color);
	}

	void Renderer::ScreenDrawBox(const int2& bottomLeft, const int2& topRight, const uint32_t color)
	{
		Screen()->Box(bottomLeft.x, bottomLeft.y, topRight.x, topRight.y, color);
	}

	void Renderer::ScreenDrawRect(const RectInt& rect, const uint32_t color)
	{
		ScreenDrawBox(rect.Bottomleft(), rect.TopRight(), color);
	}

	void Renderer::ScreenDrawSprite(const RectInt& rect, const Sprite* sprite)
	{
		const int2 bl = rect.Bottomleft();

		if (ScreenFullyInFrame(rect))
		{
			sprite->DrawScaled(bl.x, bl.y, rect.Size.x, rect.Size.y, Screen());
		}
		else
		{
			sprite->DrawScaledSafe(bl.x, bl.y, rect.Size.x, rect.Size.y, Screen());
		}
	}

	void Renderer::ScreenDrawBoxSolid(const int2& bottomLeft, const int2& topRight, const uint32_t color)
	{
		const int2 a = { Math::Clamp(bottomLeft.x, 0, Renderer::ScreenSize().x), Math::Clamp(bottomLeft.y, 0, Renderer::ScreenSize().y) };
		const int2 b = { Math::Clamp(topRight.x, 0, Renderer::ScreenSize().x), Math::Clamp(topRight.y, 0, Renderer::ScreenSize().y) };

		for (int y = b.y; y < a.y; y++) for (int x = a.x; x < b.x; x++)
		{
			Screen()->Plot(x, y, color);
		}
	}

	void Renderer::ScreenDrawLine(const int2& a, const int2& b, const uint32_t color)
	{
		Screen()->Line(Cast<float>(a.x), Cast<float>(a.y), Cast<float>(b.x), Cast<float>(b.y), color);
	}

	void Renderer::ScreenDrawCircle(const int2& point, const uint32_t radius, const uint32_t color)
	{
		for (uint32_t i = 0; i < CIRCLE_RENDERING_SEGMENTS - 1; i++)
		{
			const float angle = Math::Pi2 / CIRCLE_RENDERING_SEGMENTS;
			Screen()->Line(point.x + Math::Sin(angle * i) * radius, point.y + Math::Cos(angle * i) * radius, point.x + Math::Sin(angle * (i + 1)) * radius, point.y + Math::Cos(angle * (i + 1)) * radius, color);
		}
	}

	int2 Renderer::FlipVerticalScreenSpace(const int2& value)
	{
		return { value.x, ScreenSize().y - value.y };
	}

	float2 Renderer::WorldViewPosition()
	{
		return s_Instance->m_Camera->GetPosition() * s_Instance->m_RenderScale;
	}

	bool Renderer::WorldInFrame(const RectFloat& rect)
	{
		const RectInt screenRect = WorldRectToScreenRect(rect);
		return ScreenInFrame(screenRect);
	}

	bool Renderer::ScreenInFrame(const RectInt& rect)
	{
		const int2 bl = rect.Bottomleft();
		const int2 tr = rect.TopRight();

		return ScreenInFrame({ Math::Min(bl.x, tr.x), Math::Max(bl.y, tr.y) }, {Math::Max(bl.x, tr.x), Math::Min(bl.y, tr.y)});
	}

	bool Renderer::WorldInFrame(const float2& bottomLeft, const float2& topRight)
	{
		const int2 a = WorldToScreenSpace(bottomLeft);
		const int2 b = WorldToScreenSpace(topRight);
		return ScreenInFrame(a, b);
	}

	bool Renderer::ScreenInFrame(const int2& bottomLeft, const int2& topRight)
	{
		VISDEBUGONLY(Renderer::ScreenDrawBox(bottomLeft, topRight, RgbColor(191, 99, 8)));

		return!(bottomLeft.x > ScreenSize().x ||
			bottomLeft.y < 0 ||
			topRight.x < 0 ||
			topRight.y > ScreenSize().y);
	}



	bool Renderer::WorldFullyInFrame(const RectFloat& rect)
	{
		const RectInt screenRect = WorldRectToScreenRect(rect);
		return ScreenFullyInFrame(screenRect);
	}

	bool Renderer::ScreenFullyInFrame(const RectInt& rect)
	{
		const int2 bl = rect.Bottomleft();
		const int2 tr = rect.TopRight();

		return ScreenFullyInFrame({ Math::Min(bl.x, tr.x), Math::Max(bl.y, tr.y) }, { Math::Max(bl.x, tr.x), Math::Min(bl.y, tr.y) });
	}

	bool Renderer::WorldFullyInFrame(const float2& bottomLeft, const float2& topRight)
	{
		const int2 a = WorldToScreenSpace(bottomLeft);
		const int2 b = WorldToScreenSpace(topRight);
		return ScreenFullyInFrame(a, b);
	}

	bool Renderer::ScreenFullyInFrame(const int2& bottomLeft, const int2& topRight)
	{
		VISDEBUGONLY(Renderer::ScreenDrawBox(bottomLeft, topRight, RgbColor(191, 99, 8)));

		return!(topRight.x > ScreenSize().x - 1 ||
			topRight.y < 0 ||
			bottomLeft.x < 0 ||
			bottomLeft.y > ScreenSize().y - 1);
	}
}