
#include <SFML/Graphics.hpp>

using namespace sf;

int main()
{
	RenderWindow window(VideoMode(256, 256), "15-Puzzle! for Ravesli.com");
	
	// Çàäàåì ìàêñèìàëüíóþ ÷àñòîòó êàäðîâ (èíà÷å ýôôåêò àíèìàöèè ìîæåò áûòü íåçàìåòåí)
	window.setFramerateLimit(60);

	// Ñîçäàíèå è çàãðóçêà òåêñòóðû
	Texture texture;
	texture.loadFromFile("images/15.png");

	// Ðàçìåðû îäíîãî áëîêà - 64 ïèêñåëÿ
	int blockWidht = 64;

	// Ëîãè÷åñêîå ïðåäñòàâëåíèå èãðîâîãî ïîëÿ
	int grid[6][6] = { 0 };

	// Ìàññèâ ñïðàéòîâ
	Sprite sprite[17];

	// Ñîçäàåì ñïðàéòû ñîîòâåòñòâóþùèõ ÷èñåë (1, 2, 3, ..., 15) è çàïîëíÿåì ÿ÷åéêè èãðîâîãî ïîëÿ
	int n = 0;
	for (int i = 0; i < 4; i++)
		for (int j = 0; j < 4; j++)
		{
			n++;
			sprite[n].setTexture(texture);
			sprite[n].setTextureRect(IntRect(i*blockWidht, j*blockWidht, blockWidht, blockWidht));
			grid[i + 1][j + 1] = n;
		}
		
	
	// Ãëàâíûé öèêë ïðèëîæåíèÿ: âûïîëíÿåòñÿ, ïîêà îòêðûòî îêíî
	while (window.isOpen())
	{
		// Îáðàáàòûâàåì ñîáûòèÿ â öèêëå
		Event event;
		while (window.pollEvent(event))
		{
			// Ïîëüçîâàòåëü íàæàë íà «êðåñòèê» è õî÷åò çàêðûòü îêíî?
			if (event.type == Event::Closed)
				// òîãäà çàêðûâàåì åãî
			    window.close();

			// Ïîëüçîâàòåëü ùåëêíóë ìûøêîé?
			if (event.type == Event::MouseButtonPressed)
			{
				// Åñëè ýòî áûëà ëåâàÿ êíîïêà ìûøè, òî ïðîáóåì âûïîëíèòü ïåðåñòàíîâêó "ïÿòíàøåê"
				if (event.key.code == Mouse::Left)
				{
					// Ïîëó÷àåì êîîðäèíàòû òîãî ìåñòà, ãäå áûë ïðîèçâåäåí ùåë÷îê
					Vector2i position = Mouse::getPosition(window);
					
					// Ïåðåâîäèì ýòè êîîðäèíàòû â êîîðäèíàòû íàøèõ áëîêîâ
					int x = position.x / blockWidht + 1;
					int y = position.y / blockWidht + 1;

					// Ïåðåìåííûå äëÿ çàäàíèÿ ñìåùåíèÿ...
					int dx = 0; //...ãîðèçîíòàëüíîãî...
					int dy = 0; //...è âåðòèêàëüíîãî.

					// Åñëè ñïðàâà ïóñòîå ìåñòî
					if (grid[x + 1][y] == 16) { dx = 1; dy = 0; };
					
					// Åñëè ñíèçó ïóñòîå ìåñòî
					if (grid[x][y + 1] == 16) { dx = 0; dy = 1; };
					
					// Åñëè ñâåðõó ïóñòîå ìåñòî
					if (grid[x][y - 1] == 16) { dx = 0; dy = -1; };
					
					// Åñëè ñëåâà ïóñòîå ìåñòî
					if (grid[x - 1][y] == 16) { dx = -1; dy = 0; };

					// Ìåíÿåì ìåñòàìè ïóñòóþ êëåòêó ñ âûáðàííûì áëîêîì
					int temp = grid[x][y];
					grid[x][y] = 16;
					grid[x + dx][y + dy] = temp;

					// Äîáàâëÿåì àíèìàöèþ ïåðåìåùåíèÿ áëîêîâ

					// Ñòàâèì ïóñòîé áëîê íà ìåñòî âûáðàííîãî ïîëüçîâàòåëåì áëîêà
					sprite[16].move(-dx * blockWidht, -dy * blockWidht);
					// Ñêîðîñòü àíèìàöèè
					float speed = 6;
					for (int i = 0; i < blockWidht; i += speed)
					{
						// Äâèãàåì âûáðàííûé áëîê
						sprite[temp].move(speed*dx, speed*dy);
						// Îòðèñîâûâàåì ïóñòîé áëîê
						window.draw(sprite[16]);
						// Îòðèñîâûâàåì âûáðàííûé áëîê
						window.draw(sprite[temp]);
						// Îòîáðàæàåì âñþ êîìïîçèöèþ â îêíå
						window.display();
					}
				}
					
			}
				
		}

		
		// Óñòàíîâêà öâåòà ôîíà - áåëûé
		window.clear(Color::White);

		// Óñòàíîâêà êàæäîãî ñïðàéòà íà ñâîå ìåñòî + Îòðèñîâêà ñïðàéòà
		for (int i = 0; i < 4; i++)
			for (int j = 0; j < 4; j++)
			{
				// Ñ÷èòûâàåì çíà÷åíèå ÿ÷åéêè èãðîâîãî ïîëÿ
				int n = grid[i + 1][j + 1];
				// è óñòàíàâëèâàåì íà íåå ñîîòâåòñòâóþùèé ñïðàéò
				sprite[n].setPosition(i*blockWidht, j*blockWidht);
				// Îòðèñîâêà ñïðàéòà
				window.draw(sprite[n]);
			}
		

		// Îòðèñîâêà îêíà
		window.display();

	}
	
	return 0;
}



