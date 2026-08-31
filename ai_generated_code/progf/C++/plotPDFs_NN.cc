// Absolutely epic failed attempt at plotting NNPDFs. See plotPDFs_NNN.cc (Drafted using common development resources) for the functional version
#include <LHAPDF/LHAPDF.h>
#include <TCanvas.h>
#include <TGraph.h>
#include <TLegend.h>
#include <TAxis.h>
#include <iostream>
#include <TGraphAsymmErrors.h>
#include <TGraphErrors.h>
#include <cmath>

int main() {
	const std::string pdfSet = "NNPDF40_lo_as_01180";
	std::vector<LHAPDF::PDF*> pdfs = LHAPDF::mkPDFs(pdfSet); //0th member of the set
	LHAPDF::PDF* pdf = LHAPDF::mkPDF(pdfSet,0);
	
	const double Q =100;
	double Q2 =std::pow(Q, 2.0);
	const int nPoints = 500;
	const double xMin = 1e-4, xMax = 1.0;

	//arrays for x and PDF values
	double x[nPoints], gluon[nPoints], up[nPoints], down[nPoints], strange[nPoints], charm[nPoints], bottom[nPoints], aup[nPoints], adown[nPoints], astrange[nPoints], acharm[nPoints], abottom[nPoints];

	//upper bound of parameter variations
	double  Pgluon[nPoints], Pup[nPoints], Pdown[nPoints], Pstrange[nPoints], Pcharm[nPoints], Pbottom[nPoints], Paup[nPoints], Padown[nPoints], Pastrange[nPoints], Pacharm[nPoints], Pabottom[nPoints];

	// average values of members corresponding to member 0
	double  Pdeltag[nPoints], Pdeltau[nPoints], Pdeltad[nPoints], Pdeltas[nPoints], Pdeltac[nPoints], Pdeltab[nPoints], Pdeltaau[nPoints], Pdeltaad[nPoints], Pdeltaas[nPoints], Pdeltaac[nPoints], Pdeltaab[nPoints];

	// actual uncertainty 
	double  Mgluon[nPoints], Mup[nPoints], Mdown[nPoints], Mstrange[nPoints], Mcharm[nPoints], Mbottom[nPoints], Maup[nPoints], Madown[nPoints], Mastrange[nPoints], Macharm[nPoints], Mabottom[nPoints];

	//lower bound of uncertainty
	double  Mdeltag[nPoints], Mdeltau[nPoints], Mdeltad[nPoints], Mdeltas[nPoints], Mdeltac[nPoints], Mdeltab[nPoints], Mdeltaau[nPoints], Mdeltaad[nPoints], Mdeltaas[nPoints], Mdeltaac[nPoints], Mdeltaab[nPoints];

	for (int i = 0; i < nPoints; ++i)
	{

		x[i] = xMin * std::pow(xMax / xMin, double(i) / (nPoints - 1));
		gluon[i] = pdf->xfxQ2(21, x[i], Q2); //Gluon (ID 21)
		down[i] = pdf->xfxQ2(1, x[i], Q2); //Down (ID 1)
		up[i] = pdf->xfxQ2(2, x[i], Q2); //Up (ID 2)
		strange[i] = pdf->xfxQ2(3, x[i], Q2); //Strange (ID 3)
		charm[i] = pdf->xfxQ2(4, x[i], Q2); //Charm (ID 4)
		bottom[i] = pdf->xfxQ2(5, x[i], Q2); //Bottom (ID 5)

		adown[i] = pdf->xfxQ2(-1, x[i], Q2); //anti-Down (ID 1)
		aup[i] = pdf->xfxQ2(-2, x[i], Q2); //anti-Up (ID 2)
		astrange[i] = pdf->xfxQ2(-3, x[i], Q2); //anti-Strange (ID 3)
		acharm[i] = pdf->xfxQ2(-4, x[i], Q2); //anti-Charm (ID 4)
		abottom[i] = pdf->xfxQ2(-5, x[i], Q2); //anti-Bottom (ID 5)

		//Setting initial uncertainty to zero because c++ is fucking stupid and sometimes sets values to NaN
		Pdeltag[i] = 0.0;

		Pdeltau[i] = 0.0;

		Pdeltad[i] = 0.0;

		Pdeltas[i] = 0.0;

		Pdeltac[i] = 0.0;

		Pdeltab[i] = 0.0;

		Pdeltaau[i] = 0.0;

		Pdeltaad[i] = 0.0;

		Pdeltaas[i] = 0.0;

		Pdeltaac[i] = 0.0;

		Pdeltaab[i] = 0.0;

		//average value loop
		for (size_t j = 1; j < pdfs.size(); j+=1)
		{

			Pgluon[i] = pdfs[j]->xfxQ2(21, x[i], Q2); //Gluon (ID 21)
			Pdown[i] = pdfs[j]->xfxQ2(1, x[i], Q2); //Down (ID 1)
			Pup[i] = pdfs[j]->xfxQ2(2, x[i], Q2); //Up (ID 2)
			Pstrange[i] = pdfs[j]->xfxQ2(3, x[i], Q2); //Strange (ID 3)
			Pcharm[i] = pdfs[j]->xfxQ2(4, x[i], Q2); //Charm (ID 4)
			Pbottom[i] = pdfs[j]->xfxQ2(5, x[i], Q2); //Bottom (ID 5)

			Padown[i] = pdfs[j]->xfxQ2(-1, x[i], Q2); //anti-Down (ID 1)
			Paup[i] = pdfs[j]->xfxQ2(-2, x[i], Q2); //anti-Up (ID 2)
			Pastrange[i] = pdfs[j]->xfxQ2(-3, x[i], Q2); //anti-Strange (ID 3)
			Pacharm[i] = pdfs[j]->xfxQ2(-4, x[i], Q2); //anti-Charm (ID 4)
			Pabottom[i] = pdfs[j]->xfxQ2(-5, x[i], Q2); //anti-Bottom (ID 5)



			std::cout << "Pcharm[" << i << "] = " << Pcharm[i] << std::endl;
			std::cout << "Mcharm[" << i << "] = " << Mcharm[i] << std::endl;
			std::cout << "charm[" << i << "] = " << charm[i] << std::endl;
			/*	std::cout << "test[" << i << "] = " << std::max(gluon[i] - Pgluon[i], gluon[i] - Mgluon[i]) << std::endl;
			*/

			//summation part of average
			Pdeltag[i] += Pgluon[i];


			Pdeltau[i] += Pup[i];

			Pdeltad[i] += Pdown[i];

			Pdeltas[i] += Pstrange[i];

			Pdeltac[i] += Pcharm[i];

			Pdeltab[i] += Pbottom[i];


			Pdeltaau[i] += Paup[i];

			Pdeltaad[i] += Padown[i];

			Pdeltaas[i] += Pastrange[i];

			Pdeltaac[i] += Pacharm[i];

			Pdeltaab[i] += Pabottom[i];

		}

		//average value calculation
		Pdeltag[i] = std::sqrt(Pdeltag[i]/(pdfs.size()-1));

		Pdeltau[i] = std::sqrt(Pdeltau[i]/(pdfs.size()-1));

		Pdeltad[i] = std::sqrt(Pdeltad[i]/(pdfs.size()-1));

		Pdeltas[i] = std::sqrt(Pdeltas[i]/(pdfs.size()-1));

		Pdeltac[i] = std::sqrt(Pdeltac[i]/(pdfs.size()-1));

		Pdeltab[i] = std::sqrt(Pdeltab[i]/(pdfs.size()-1));

		Pdeltaau[i] = std::sqrt(Pdeltaau[i]/(pdfs.size()-1));

		Pdeltaad[i] = std::sqrt(Pdeltaad[i]/(pdfs.size()-1));

		Pdeltaas[i] = std::sqrt(Pdeltaas[i]/(pdfs.size()-1));

		Pdeltaac[i] = std::sqrt(Pdeltaac[i]/(pdfs.size()-1));

		Pdeltaab[i] = std::sqrt(Pdeltaab[i]/(pdfs.size()-1));

		
		//uncertainty loop
		for (size_t k = 1; k < pdfs.size(); k+=1)
		{

			Pgluon[i] = pdfs[k]->xfxQ2(21, x[i], Q2); //Gluon (ID 21)
			Pdown[i] = pdfs[k]->xfxQ2(1, x[i], Q2); //Down (ID 1)
			Pup[i] = pdfs[k]->xfxQ2(2, x[i], Q2); //Up (ID 2)
			Pstrange[i] = pdfs[k]->xfxQ2(3, x[i], Q2); //Strange (ID 3)
			Pcharm[i] = pdfs[k]->xfxQ2(4, x[i], Q2); //Charm (ID 4)
			Pbottom[i] = pdfs[k]->xfxQ2(5, x[i], Q2); //Bottom (ID 5)

			Padown[i] = pdfs[k]->xfxQ2(-1, x[i], Q2); //anti-Down (ID 1)
			Paup[i] = pdfs[k]->xfxQ2(-2, x[i], Q2); //anti-Up (ID 2)
			Pastrange[i] = pdfs[k]->xfxQ2(-3, x[i], Q2); //anti-Strange (ID 3)
			Pacharm[i] = pdfs[k]->xfxQ2(-4, x[i], Q2); //anti-Charm (ID 4)
			Pabottom[i] = pdfs[k]->xfxQ2(-5, x[i], Q2); //anti-Bottom (ID 5)


			//calculating asymmetric uncertainty

			std::cout << "Pcharm[" << i << "] = " << Pcharm[i] << std::endl;
			std::cout << "Mcharm[" << i << "] = " << Mcharm[i] << std::endl;
			std::cout << "charm[" << i << "] = " << charm[i] << std::endl;
			/*	std::cout << "test[" << i << "] = " << std::max(gluon[i] - Pgluon[i], gluon[i] - Mgluon[i]) << std::endl;
			*/

			//summation part of uncertainty
			Mdeltag[i] += std::pow((Pdeltag[i] - Pgluon[i]),2);


			Mdeltau[i] += std::pow((Pdeltau[i] - Pup[i]),2);

			Mdeltad[i] += std::pow(( Pdeltad[i] - Pdown[i]),2);

			Mdeltas[i] += std::pow(( Pdeltas[i] - Pstrange[i]),2);

			Mdeltac[i] += std::pow(( Pdeltac[i] - Pcharm[i]),2);

			Mdeltab[i] += std::pow(( Pdeltab[i] - Pbottom[i]),2);


			Mdeltaau[i] += std::pow(( Pdeltaau[i] - Paup[i]),2);

			Mdeltaad[i] += std::pow(( Pdeltaad[i] - Padown[i]),2);

			Mdeltaas[i] += std::pow(( Pdeltaas[i] - Pastrange[i]),2);

			Mdeltaac[i] += std::pow(( Pdeltaac[i] - Pacharm[i]),2);

			Mdeltaab[i] += std::pow(( Pdeltaab[i] - Pabottom[i]),2);

		}

		Mdeltag[i] = std::sqrt(Mdeltag[i]/(pdfs.size()-2));

		Mdeltau[i] = std::sqrt(Mdeltau[i]/(pdfs.size()-2));

		Mdeltad[i] = std::sqrt(Mdeltad[i]/(pdfs.size()-2));

		Mdeltas[i] = std::sqrt(Mdeltas[i]/(pdfs.size()-2));

		Mdeltac[i] = std::sqrt(Mdeltac[i]/(pdfs.size()-2));

		Mdeltab[i] = std::sqrt(Mdeltab[i]/(pdfs.size()-2));

		Mdeltaau[i] = std::sqrt(Mdeltaau[i]/(pdfs.size()-2));

		Mdeltaad[i] = std::sqrt(Mdeltaad[i]/(pdfs.size()-2));

		Mdeltaas[i] = std::sqrt(Mdeltaas[i]/(pdfs.size()-2));

		Mdeltaac[i] = std::sqrt(Mdeltaac[i]/(pdfs.size()-2));

		Mdeltaab[i] = std::sqrt(Mdeltaab[i]/(pdfs.size()-2));

	
	}

	// TGraph stuff
	TGraphErrors* gGluonUnc = new TGraphErrors(nPoints, x, Pdeltag,  nullptr, Mdeltag);

	TGraphErrors* gUpUnc = new TGraphErrors(nPoints, x, Pdeltau,  nullptr, Mdeltau);
	TGraphErrors* gDownUnc = new TGraphErrors(nPoints, x, Pdeltad,  nullptr, Mdeltad);
	TGraphErrors* gCharmUnc = new TGraphErrors(nPoints, x, Pdeltac,  nullptr, Mdeltac);
	TGraphErrors* gStrangeUnc = new TGraphErrors(nPoints, x, Pdeltas,  nullptr, Mdeltas);
	TGraphErrors* gBottomUnc = new TGraphErrors(nPoints, x, Pdeltab,  nullptr, Mdeltab);

	TGraphErrors* gAUpUnc = new TGraphErrors(nPoints, x, Pdeltau,  nullptr, Mdeltaau);
	TGraphErrors* gADownUnc = new TGraphErrors(nPoints, x, Pdeltad,  nullptr, Mdeltaad);
	TGraphErrors* gACharmUnc = new TGraphErrors(nPoints, x, Pdeltac,  nullptr, Mdeltaac);
	TGraphErrors* gAStrangeUnc = new TGraphErrors(nPoints, x, Pdeltas,  nullptr, Mdeltaas);
	TGraphErrors* gABottomUnc = new TGraphErrors(nPoints, x, Pdeltab,  nullptr, Mdeltaab);

	//stylling
    gGluonUnc->SetFillColorAlpha(kRed, 0.3);
    gUpUnc->SetFillColorAlpha(kBlue, 0.3);
    gDownUnc->SetFillColorAlpha(kGreen, 0.3);
    gStrangeUnc->SetFillColorAlpha(kMagenta, 0.3);
    gCharmUnc->SetFillColorAlpha(kCyan, 0.3);
    gBottomUnc->SetFillColorAlpha(kOrange, 0.3);
	gGluonUnc->SetLineColor(kRed);  
	gUpUnc->SetLineColor(kBlue);
	gDownUnc->SetLineColor(kGreen);
	gStrangeUnc->SetLineColor(kMagenta);
	gCharmUnc->SetLineColor(kCyan);
	gBottomUnc->SetLineColor(kOrange);

	gGluonUnc->SetFillStyle(1004);
	gUpUnc->SetFillStyle(1004);
	gDownUnc->SetFillStyle(1004);
	gStrangeUnc->SetFillStyle(1004);
	gCharmUnc->SetFillStyle(1004);
	gBottomUnc->SetFillStyle(1004);

    gAUpUnc->SetFillColorAlpha(kBlue, 0.3);
    gADownUnc->SetFillColorAlpha(kGreen, 0.3);
    gAStrangeUnc->SetFillColorAlpha(kMagenta, 0.3);
    gACharmUnc->SetFillColorAlpha(kCyan, 0.3);
    gABottomUnc->SetFillColorAlpha(kOrange, 0.3);
	gAUpUnc->SetLineColor(kBlue);
	gADownUnc->SetLineColor(kGreen);
	gAStrangeUnc->SetLineColor(kMagenta);
	gACharmUnc->SetLineColor(kCyan);
	gABottomUnc->SetLineColor(kOrange);

    gAUpUnc->SetLineStyle(2);
    gADownUnc->SetLineStyle(2);
    gAStrangeUnc->SetLineStyle(2);
    gACharmUnc->SetLineStyle(2);
    gABottomUnc->SetLineStyle(2);
	gAUpUnc->SetFillStyle(3005);
	gADownUnc->SetFillStyle(3005);
	gAStrangeUnc->SetFillStyle(3005);
	gACharmUnc->SetFillStyle(3005);
	gABottomUnc->SetFillStyle(3005);

    TCanvas* c = new TCanvas("c", "PDFs", 800, 600);
    c->SetLogx();
    //c->SetLogy();

	gUpUnc->Draw("ALP");
	gGluonUnc->Draw("L SAME");
	gStrangeUnc->Draw("L SAME");
	gDownUnc->Draw("L SAME");
	gCharmUnc->Draw("L SAME");
	gBottomUnc->Draw("L SAME");

	gAUpUnc->Draw("L SAME");
	gAStrangeUnc->Draw("L SAME");
	gADownUnc->Draw("L SAME");
	gACharmUnc->Draw("L SAME");
	gABottomUnc->Draw("L SAME");

    gUpUnc->GetXaxis()->SetTitle("x");
    gUpUnc->GetYaxis()->SetTitle("xf(x, Q^{2})");
    gUpUnc->SetTitle((pdfSet+" at Q = " +std::to_string(Q/1000)+" TeV").c_str());

    
    // Create a legend
    TLegend* legend = new TLegend(0.15, 0.55, 0.4, 0.85);
    legend->AddEntry(gGluonUnc, "g", "f");
    legend->AddEntry(gUpUnc, "u", "f");
    legend->AddEntry(gDownUnc, "d", "f");
    legend->AddEntry(gStrangeUnc, "s", "f");
    legend->AddEntry(gCharmUnc, "c", "f");
    legend->AddEntry(gBottomUnc, "b", "f");

    legend->AddEntry(gAUpUnc, "#bar{u}", "f");
    legend->AddEntry(gADownUnc, "#bar{d}", "f");
    legend->AddEntry(gAStrangeUnc, "#bar{s}", "f");
    legend->AddEntry(gACharmUnc, "#bar{c}", "f");
    legend->AddEntry(gABottomUnc, "#bar{b}", "f");
/*	
    legend->AddEntry(gAup, "#bar{u}", "l");
    legend->AddEntry(gAdown, "#bar{d}", "l");
    legend->AddEntry(gAstrange, "#bar{s}", "l");
    legend->AddEntry(gAcharm, "#bar{c}", "l");
    legend->AddEntry(gAbottom, "#bar{b}", "l");
	*/
    legend->Draw();

    // Save the plot
    c->SaveAs((pdfSet + "PDFs.pdf").c_str());

    return 0;
}
