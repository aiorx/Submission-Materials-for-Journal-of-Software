//Below code is Assisted using common GitHub development aids and modified by me to fit my project requirements.
// `src/main/java/com/example/liambuckleyfyp/controller/GolfCourseController.java`
// `src/main/java/com/example/liambuckleyfyp/controller/GolfCourseController.java`
// GolfCourseController.java
// GolfCourseController.java
package com.example.liambuckleyfyp.controller;

import com.example.liambuckleyfyp.model.Booking;
import com.example.liambuckleyfyp.model.GolfCourse;
import com.example.liambuckleyfyp.model.Review;
import com.example.liambuckleyfyp.service.BookingService;
import com.example.liambuckleyfyp.service.SendGridEmailService;
import com.example.liambuckleyfyp.service.GolfCourseService;
import com.example.liambuckleyfyp.service.ReviewService;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.List;

@Controller
public class GolfCourseController {

    private static final Logger logger = LoggerFactory.getLogger(GolfCourseController.class.getName());

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private GolfCourseService golfCourseService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private SendGridEmailService emailService;

    @GetMapping("/golfcourses")
    public String getAllGolfCourses(Model model, HttpSession session) {
        List<GolfCourse> golfCourses = golfCourseService.getAllGolfCourses();
        model.addAttribute("golfCourses", golfCourses);
        String userLogin = (String) session.getAttribute("userLogin");
        model.addAttribute("userLogin", userLogin);
        return "golfcourse_list";
    }

    @GetMapping("/golfcourse/{id}")
    public String getGolfCourseDetails(@PathVariable("id") int id, Model model) {
        GolfCourse golfCourse = golfCourseService.getGolfCourseById(id);
        List<Review> reviews = reviewService.getReviewsByGolfCourseId(id);
        model.addAttribute("golfCourse", golfCourse);
        model.addAttribute("reviews", reviews);
        logger.info("GolfCourse times: " + golfCourse.getTimes());
        return "individualgolfcourse";
    }

    @PostMapping("/book")
    public String bookTime(@RequestParam("golfCourseId") Long golfCourseId, @RequestParam("time") String time, @RequestParam("date") String date, Model model, HttpSession session) {
        String userLogin = (String) session.getAttribute("userLogin");
        if (userLogin == null) {
            return "redirect:/login";
        }

        GolfCourse golfCourse = golfCourseService.getGolfCourseById(golfCourseId.intValue());
        if (golfCourse == null) {
            model.addAttribute("errorMessage", "Golf course not found.");
            return "error_page";
        }

        model.addAttribute("golfCourse", golfCourse);
        model.addAttribute("time", time);
        model.addAttribute("date", date);
        model.addAttribute("userLogin", userLogin);

        boolean success = bookingService.bookTimeSlot(golfCourseId, time, date);
        if (!success) {
            model.addAttribute("errorMessage", "Time slot not available. Please choose another time.");
            return "error_page";
        }

        // Save the booking details
        Booking booking = new Booking();
        booking.setUserLogin(userLogin);
        booking.setTime(time);
        booking.setDate(date);
        bookingService.saveBooking(booking, golfCourseId.intValue());

        String to = "liambuckley381@gmail.com";
        String secondTo = "buckleykid10@gmail.com";
        String subject = "Booking Confirmation via TeeFinder";
        String text = "Hello " + userLogin + ",\n\nYou have booked a time slot at " + golfCourse.getName() + " on " + date + " at " + time + ".\n\nThank you for using TeeFinder ⛳️.";
        String secondText = "Dear " + secondTo + ",\n\nA new booking has been made by " + userLogin + " at your golf club " + golfCourse.getName() + " on " + date + " at " + time + ".\n\nBest regards,\nTeeFinder Team ⛳️.";

        try {
            emailService.sendBookingConfirmation(to, subject, text);
            emailService.sendBookingConfirmation(secondTo, subject, secondText);
        } catch (IOException e) {
            logger.error("Failed to send booking confirmation email", e);
            model.addAttribute("errorMessage", "Failed to send booking confirmation email. Please try again later.");
            return "error_page";
        }

        return "booking_confirmation";
    }

    @GetMapping("/search")
    public String search(@RequestParam("date") String date, Model model) {
        List<GolfCourse> golfCourses = golfCourseService.findGolfCoursesByDate(date);
        model.addAttribute("golfCourses", golfCourses);
        return "golfcourse_list";
    }

    @GetMapping("/searchByName")
    public String searchByName(@RequestParam("name") String name, Model model) {
        List<GolfCourse> golfCourses = golfCourseService.findGolfCoursesByName(name);
        model.addAttribute("golfCourses", golfCourses);
        return "golfcourse_list";
    }

    @GetMapping("/golfcourse/{id}/review")
    public String showReviewForm(@PathVariable("id") int id, Model model) {
        GolfCourse golfCourse = golfCourseService.getGolfCourseById(id);
        model.addAttribute("golfCourse", golfCourse);
        return "submit_review";
    }

    @PostMapping("/golfcourse/review")
    public String submitReview(@RequestParam("golfCourseId") Long golfCourseId, @RequestParam("review") String review, @RequestParam("rating") int rating, Model model, HttpSession session) {
        String userLogin = (String) session.getAttribute("userLogin");

        Review newReview = new Review();
        newReview.setGolfCourseId(golfCourseId);
        newReview.setUserLogin(userLogin);
        newReview.setReview(review);
        newReview.setRating(rating);
        reviewService.saveReview(newReview);

        return "redirect:/golfcourse/" + golfCourseId;
    }

    @PostMapping("/cancelBooking")
    public String cancelBooking(@RequestParam("golfCourseId") Long golfCourseId, @RequestParam("time") String time, @RequestParam("date") String date, HttpSession session, Model model) {
        String userLogin = (String) session.getAttribute("userLogin");
        boolean isCancelled = bookingService.cancelBooking(golfCourseId, time, date, userLogin);
        if (isCancelled) {
            model.addAttribute("successMessage", "Booking cancelled successfully.");
            return "redirect:/golfcourses";
        } else {
            model.addAttribute("errorMessage", "Failed to cancel booking. Please try again.");
            return "error_page";
        }
    }

    @GetMapping("/myBookings")
    public String viewBookings(Model model, HttpSession session) {
        String userLogin = (String) session.getAttribute("userLogin");
        if (userLogin == null) {
            return "redirect:/login";
        }

        List<Booking> bookings = bookingService.getBookingsByUserLogin(userLogin);
        model.addAttribute("bookings", bookings);
        return "mybookings"; // Ensure this matches the template name
    }

    @PostMapping("/bookTime")
    public String bookTime(@RequestParam("golfCourseId") int golfCourseId,
                           @RequestParam("userLogin") String userLogin,
                           @RequestParam("time") String time,
                           @RequestParam("date") String date) {
        Booking booking = new Booking();
        booking.setUserLogin(userLogin);
        booking.setTime(time);
        booking.setDate(date);
        bookingService.saveBooking(booking, golfCourseId);
        return "redirect:/booking_confirmation";
    }

    @PostMapping("/cancelMyBooking")
    public String cancelMyBooking(@RequestParam("golfCourseId") int golfCourseId,
                                  @RequestParam("time") String time,
                                  @RequestParam("date") String date,
                                  @RequestParam("userLogin") String userLogin,
                                  Model model) {
        boolean isCancelled = bookingService.cancelBooking((long) golfCourseId, time, date, userLogin);
        if (isCancelled) {
            // Update the list of bookings
            model.addAttribute("bookings", bookingService.getBookingsByUserLogin(userLogin));
        }
        return "redirect:/myBookings";
    }
}

//References
//GitHub Co-pilot
//License to: Liam Buckley(liambuckley02)
//License restriction: For educational use only
//Valid through: November 2nd 2025