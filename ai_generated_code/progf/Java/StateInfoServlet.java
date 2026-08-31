package myproject1.project1task3;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet that handles requests for detailed information about US states,
 * such as population, state flag, nickname, motto, anthem, and map.
 * It delegates the fetching of this information to the StateInfoModel class.
 *
 * The init is provided Adapted from standard coding samples, other is written by me
 */
@WebServlet(name = "StateInfoServlet", urlPatterns = {"/stateInfo"})
public class StateInfoServlet extends HttpServlet {
    // Instance of StateInfoModel to access information fetching methods.
    protected StateInfoModel model;

    /**
     * Servlet initialization method. Instantiates the StateInfoModel.
     */
    @Override
    public void init() {
        model = new StateInfoModel();
    }

    /**
     * Processes GET requests by fetching state information based on the provided state name parameter.
     * Sets the fetched information as request attributes for rendering in the JSP view.
     *
     * @param request  The HttpServletRequest object that contains the request the client has made of the servlet.
     * @param response The HttpServletResponse object that contains the response the servlet sends to the client.
     * @throws ServletException If an exception occurs that interferes with the servlet's normal operation.
     * @throws IOException If an input or output exception occurs.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Retrieve the state name from the request parameter.
        String stateName = request.getParameter("stateName");

        if (stateName != null) {
            try {
                // Fetch various pieces of information about the state using the model.
                String population = model.fetchPopulation(stateName);
                String stateFlagUrl = model.fetchStateFlag(stateName);
                String stateNickname = model.fetchNickname(stateName);
                String stateMotto = model.fetchMotto(stateName);
                String fetchAnthem = model.fetchAnthem(stateName);
                String fetchMap = model.fetchStateMap(stateName);

                // Set the fetched information as attributes on the request object for access in the JSP.
                request.setAttribute("stateName", stateName);
                request.setAttribute("population", population);
                request.setAttribute("stateFlagUrl", stateFlagUrl);
                request.setAttribute("stateNickname", stateNickname);
                request.setAttribute("stateMotto", stateMotto);
                request.setAttribute("fetchAnthem", fetchAnthem);
                request.setAttribute("fetchMap", fetchMap);

            } catch (IOException e) {
                request.setAttribute("error", "Error fetching state data: " + e.getMessage());
            }
        }
        // Forward to JSP (view)
        request.getRequestDispatcher("result.jsp").forward(request, response);
    }
}