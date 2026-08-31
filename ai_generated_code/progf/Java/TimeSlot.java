//Below code is a mix of code Aided via basic GitHub coding utilities (line 10-32) and my own code.
package com.example.liambuckleyfyp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "golfcourse_times")
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique identifier for the time slot

    @Column(name = "times", nullable = false)
    private String time; // Time of the slot

    @Column(nullable = false)
    private String date; // Date of the slot

    @ManyToOne
    @JoinColumn(name = "golfcourse_id", nullable = false)
    private GolfCourse golfCourse; // Reference to the associated golf course

    // Default constructor
    public TimeSlot() {}

    // Parameterized constructor
    public TimeSlot(String time, String date, GolfCourse golfCourse) {
        this.time = time;
        this.date = date;
        this.golfCourse = golfCourse;
    }

    // Getter for the 'id' field
    public Long getId() {
        return id;
    }

    // Setter for the 'id' field
    public void setId(Long id) {
        this.id = id;
    }

    // Getter for the 'time' field
    public String getTime() {
        return time;
    }

    // Setter for the 'time' field
    public void setTime(String time) {
        this.time = time;
    }

    // Getter for the 'date' field
    public String getDate() {
        return date;
    }

    // Setter for the 'date' field
    public void setDate(String date) {
        this.date = date;
    }

    // Getter for the 'golfCourse' field no needed not needed for this iteration
    public GolfCourse getGolfCourse() {
        return golfCourse;
    }

    // Setter for the 'golfCourse' field not needed for this iteration
    public void setGolfCourse(GolfCourse golfCourse) {
        this.golfCourse = golfCourse;
    }
}
//References
//GitHub Co-pilot
//License to: Liam Buckley(liambuckley02)
//License restriction: For educational use only
//Valid through: November 2nd 2025