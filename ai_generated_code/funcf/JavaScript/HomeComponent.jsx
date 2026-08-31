export default function HomeComponent() {
    console.log(carData);
    return (
        <div className="container-home">
            <div className="container-home-1">
                <p className="container-home-1-text">
                    DRIVE YOUR DREAM
                </p>
            </div>

            <div className="container-home-intro">
                <div className="container-home-title">
                    <p className="container-title">Why Choose Us?</p>
                    <hr />
                </div>
                <div className="container-home-intro-cards">
                    {/* Descriptions for headers Assisted with basic coding tools  */}
                    <div className="container-home-intro-card">
                        <svg xmlns="http://www.w3.org/2000/svg" height="5rem" width="5rem" viewBox="0 0 512 512"><path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32H346.6c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2V400v48c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V400H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V400 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" /></svg>
                        <div className="container-home-intro-card-text">
                            <h2>MASSIVE SELECTION</h2>
                            <p>Our showroom boasts an unparalleled variety of vehicles, ranging from sleek sedans and robust SUVs to nimble compacts and powerful trucks. Whatever your driving aspirations may be, our extensive selection ensures that you find the perfect match to suit your style and needs.</p>
                        </div>
                    </div>
                    <div className="container-home-intro-card">
                        <svg xmlns="http://www.w3.org/2000/svg" height="5rem" width="5rem" viewBox="0 0 512 512"><path d="M32 64C32 28.7 60.7 0 96 0H256c35.3 0 64 28.7 64 64V256h8c48.6 0 88 39.4 88 88v32c0 13.3 10.7 24 24 24s24-10.7 24-24V222c-27.6-7.1-48-32.2-48-62V96L384 64c-8.8-8.8-8.8-23.2 0-32s23.2-8.8 32 0l77.3 77.3c12 12 18.7 28.3 18.7 45.3V168v24 32V376c0 39.8-32.2 72-72 72s-72-32.2-72-72V344c0-22.1-17.9-40-40-40h-8V448c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32V64zM96 80v96c0 8.8 7.2 16 16 16H240c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16H112c-8.8 0-16 7.2-16 16z" /></svg>
                        <div className="container-home-intro-card-text">
                            <h2>FUEL EFFICIENT</h2>
                            <p>Save more at the pump and in the long run with our fuel-efficient options. Experience the joy of driving without constantly worrying about rising fuel costs. Our cars are not only environmentally conscious but also budget-friendly, ensuring you get the most out of your investment.</p>
                        </div>
                    </div>
                    <div className="container-home-intro-card">
                        <svg xmlns="http://www.w3.org/2000/svg" height="5rem" width="5rem" viewBox="0 0 512 512"><path d="M320 96H192L144.6 24.9C137.5 14.2 145.1 0 157.9 0H354.1c12.8 0 20.4 14.2 13.3 24.9L320 96zM192 128H320c3.8 2.5 8.1 5.3 13 8.4C389.7 172.7 512 250.9 512 416c0 53-43 96-96 96H96c-53 0-96-43-96-96C0 250.9 122.3 172.7 179 136.4l0 0 0 0c4.8-3.1 9.2-5.9 13-8.4zm84 88c0-11-9-20-20-20s-20 9-20 20v14c-7.6 1.7-15.2 4.4-22.2 8.5c-13.9 8.3-25.9 22.8-25.8 43.9c.1 20.3 12 33.1 24.7 40.7c11 6.6 24.7 10.8 35.6 14l1.7 .5c12.6 3.8 21.8 6.8 28 10.7c5.1 3.2 5.8 5.4 5.9 8.2c.1 5-1.8 8-5.9 10.5c-5 3.1-12.9 5-21.4 4.7c-11.1-.4-21.5-3.9-35.1-8.5c-2.3-.8-4.7-1.6-7.2-2.4c-10.5-3.5-21.8 2.2-25.3 12.6s2.2 21.8 12.6 25.3c1.9 .6 4 1.3 6.1 2.1l0 0 0 0c8.3 2.9 17.9 6.2 28.2 8.4V424c0 11 9 20 20 20s20-9 20-20V410.2c8-1.7 16-4.5 23.2-9c14.3-8.9 25.1-24.1 24.8-45c-.3-20.3-11.7-33.4-24.6-41.6c-11.5-7.2-25.9-11.6-37.1-15l0 0-.7-.2c-12.8-3.9-21.9-6.7-28.3-10.5c-5.2-3.1-5.3-4.9-5.3-6.7c0-3.7 1.4-6.5 6.2-9.3c5.4-3.2 13.6-5.1 21.5-5c9.6 .1 20.2 2.2 31.2 5.2c10.7 2.8 21.6-3.5 24.5-14.2s-3.5-21.6-14.2-24.5c-6.5-1.7-13.7-3.4-21.1-4.7V216z" /></svg>
                        <div className="container-home-intro-card-text">
                            <h2>AFFORDABLE PRICES</h2>
                            <p>Discover a range of vehicles at prices that fit your budget seamlessly. We believe in making quality cars accessible to everyone, ensuring you can drive home in the vehicle of your dreams without the hefty price tag. Say goodbye to overpriced options and hello to unbeatable deals.</p>
                        </div>
                    </div>
                    <div className="container-home-intro-card">
                        <svg xmlns="http://www.w3.org/2000/svg" height="5rem" width="5rem" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM164.1 325.5C182 346.2 212.6 368 256 368s74-21.8 91.9-42.5c5.8-6.7 15.9-7.4 22.6-1.6s7.4 15.9 1.6 22.6C349.8 372.1 311.1 400 256 400s-93.8-27.9-116.1-53.5c-5.8-6.7-5.1-16.8 1.6-22.6s16.8-5.1 22.6 1.6zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg>
                        <div className="container-home-intro-card-text">
                            <h2>CUSTOMER SATISFACTION</h2>
                            <p>Experience a car-buying process that is built on transparency and trust. We believe in clear communication, providing you with all the information you need to make informed decisions. No hidden surprises, just a straightforward and honest approach to car shopping.</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="container-home-3">
                <div className="container-home-title">
                    <p className="container-title">Featured Cars</p>
                    <hr />
                </div>
                <div className="cars-slide" >
                    <div className="grid-container-home">
                        {
                            carData.cars.map((car, index) => (
                                <div key={index} className="card car-card container-home-3-car-card">
                                    <div className="img-box">
                                        {
                                            (car.brand == "toyota") ?
                                                <img src={toyota} alt="Toyota Car" />
                                                :
                                                (car.brand == "ferrari") ?
                                                    <img src={ferrari} alt="Ferrari Car" />
                                                    :
                                                    (car.brand == "lamborghini") ?
                                                        <img src={lamborghini} alt="Lamborghini Car" />
                                                        :
                                                        (car.brand == "honda") ?
                                                            <img src={honda} alt="Honda Car" />
                                                            :
                                                            (car.brand == "mitsubishi") ?
                                                                <img src={mitsubishi} alt="Mitsubishi Car" />
                                                                :
                                                                (car.brand == "BMW") ?
                                                                    <img src={BMW} alt="BMW Car" />
                                                                    :
                                                                    (car.brand == "chevrolet") ?
                                                                        <img src={chevrolet} alt="Chevrolet Car" />
                                                                        :
                                                                        <img src={audi} alt="Grey Toyota Sedan" />

                                        }

                                    </div>

                                    <div className="card-flex">
                                        <div className="inner-card">
                                            <div className="inner-card-field"><p className="inner-card-field-name">Brand:</p>
                                                <p className="inner-card-field-value">
                                                    {car.brand}
                                                </p> </div>
                                            <div className="color-row inner-card-field"><p className="inner-card-field-name">Color:</p><div className="car-color" style={{ backgroundColor: car.color }} ></div></div>
                                            <div className="inner-card-field"><p className="inner-card-field-name">Type:</p><p className="inner-card-field-value">
                                                {car.type}
                                            </p> </div>
                                            <div className="inner-card-field"><p className="inner-card-field-name">Age:</p>
                                                <p className="inner-card-field-value">
                                                    {car.age}
                                                </p> </div>
                                        </div>
                                        <div className="car-card-cost">
                                            <h3>Starting at {car.cost}</h3>
                                        </div>
                                    </div>
                                </div>
                            )
                            )
                        }

                    </div>
                    <div className="grid-container-home">
                        {
                            carData.cars.map((car, index) => (
                                <div key={index} className="card car-card container-home-3-car-card">
                                    <div className="img-box">
                                        {
                                            (car.brand == "toyota") ?
                                                <img src={toyota} alt="Toyota Car" />
                                                :
                                                (car.brand == "ferrari") ?
                                                    <img src={ferrari} alt="Ferrari Car" />
                                                    :
                                                    (car.brand == "lamborghini") ?
                                                        <img src={lamborghini} alt="Lamborghini Car" />
                                                        :
                                                        (car.brand == "honda") ?
                                                            <img src={honda} alt="Honda Car" />
                                                            :
                                                            (car.brand == "mitsubishi") ?
                                                                <img src={mitsubishi} alt="Mitsubishi Car" />
                                                                :
                                                                (car.brand == "BMW") ?
                                                                    <img src={BMW} alt="BMW Car" />
                                                                    :
                                                                    (car.brand == "chevrolet") ?
                                                                        <img src={chevrolet} alt="Chevrolet Car" />
                                                                        :
                                                                        <img src={audi} alt="Grey Toyota Sedan" />

                                        }

                                    </div>

                                    <div className="card-flex">
                                        <div className="inner-card">
                                            <div className="inner-card-field"><strong>Brand:</strong> {car.brand} </div>
                                            <div className="color-row inner-card-field"><strong>Color:</strong><div className="car-color" style={{ backgroundColor: car.color }} ></div></div>
                                            <div className="inner-card-field"><strong>Type:</strong> {car.type}</div>
                                            <div className="inner-card-field"><strong>Age:</strong> {car.age}</div>
                                        </div>
                                        <div className="car-card-cost">
                                            <h3>Starting at {car.cost}</h3>
                                        </div>
                                    </div>
                                </div>
                            )
                            )
                        }

                    </div>
                </div>

            </div>
            <div className="container-home-2">
                <div className="container-home-title">
                    <p className="container-title">Our Customer Reviews</p>
                    <hr />
                </div>
                {/* customer reviews were augmented with ChatGPT  to be more descriptive and detailed */}
                <div className="container-home-2-cards">
                    {
                        carReviews.reviews.map((review, index) => (
                            <div className="container-home-2-card">
                                <div className="container-home-2-card-text">
                                    <img src={profile} alt="audi" className="container-home-2-card-img" />
                                    <p className="container-home-2-card-quote">
                                        {review.quote}
                                    </p>
                                </div>
                                <p className="container-home-2-card-name">
                                    - {review.name}
                                </p>
                            </div>
                        )

                        )
                    }
                </div>

            </div>
            <div className="container-home-4" >

                <svg className="container-home-4-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 100 100">
                    <path d="M 50 20 C 38.2283 20 27.556842 23.055251 19.761719 28.066406 C 11.966596 33.077561 7 40.123814 7 48 C 7 55.876186 11.966596 62.922439 19.761719 67.933594 C 27.556842 72.944749 38.2283 76 50 76 C 61.7717 76 72.443158 72.944749 80.238281 67.933594 C 88.033404 62.922439 93 55.876186 93 48 C 93 40.123814 88.033404 33.077561 80