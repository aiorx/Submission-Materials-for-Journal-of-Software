// Changing an Array Element

// const cars =['Saab','Volvo','BMW'];
// let car = cars[0]='Opel';
// console.log(cars); //output : [ 'Opel', 'Volvo', 'BMW' ]
// console.log(typeof car); //output : Opel //type:String


// Converting an Array to a String

// const fruits = ['Banana','Apple','Mango'];
// let fruit=fruits.toLocaleString();
// console.log(fruits);   //output:[ 'Banana', 'Apple', 'Mango' ]; type :Array
// console.log(fruit); //output:Banana,Apple,Mango type:String


// Arrays are objects

// const fruits=['Banana','Apple','Mango'];
// console.log(typeof fruits);


// Arrays use numbers to access its "elements". In this example, person[0] returns John:

// const person=['john','Doe',45];
// console.log(person[0]);



// Accessing the First Array Element
// const fruits = ["Banana", "Orange", "Apple", "Mango"];
// let fruit = fruits[0];
// console.log(fruit);


// Accessing the Last Array Element

// const fruits=['Banana','Apple','Mango',"John", "Doe", 46,"Saab", "Volvo", "BMW"];
// console.log(fruits[fruits.length-6]);



// Looping Array Elements

// const fruits=['Apple','Banana','Mango'];

// for(let i=0;i<fruits.length; i++){
//     console.log(fruits[i]);
// }

// fruits.forEach((value,index)=> {
//     console.log(value,index);
// })

//Adding Array element

// const fruits=['Banana','Apple','Mango',"John", "Doe", 46,"Saab", "Volvo", "BMW",1,2,3,4,5,6,7,8,10,'Cat','Cow','Crow'];
// fruits[fruits.length]='lemon';
// let fruit=fruits.length;
// for(let i =0;i <fruit; i++){
//     console.log(fruits[i]);
// }



// const fruits=['Banana','Apple','Mango',"John", "Doe", 46,"Saab", "Volvo", "BMW",1,2,3,4,5,6,7,8,10,'Cat','Cow','Crow'];

// fruits[21]='lemon';

// console.log(fruits);

// JavaScript new Array()

// const points = new Array('e',1);//যখন ইলিমেনট একটি থাকে তখন এটি ভুল উত্তর প্রদান করে। যখন নিউ অ্যারে (40) তখন আউটপুট এ কি আছে তা দেখতে চাইলে আউটপুট এ আসে (40 empty item) মানে অউটপুট খালি আসে। এটি শুধুমাত্র নাম্বার এর ক্ষেত্রে ভুল আউটপুট আশে।যদি ইলিমেনট স্ট্রিং হয় তাহলে আউটপুট ঠিক থাকে।
// const point = ['e'];
// console.log(point);
// console.log(points);


// How to Recognize an Array

// const fruits = ["apples", "bananas", "oranges"];


// console.log("Array: "+typeof fruits instanceof Array);
// console.log(Array.isArray(fruits));


//The at Method to find the element to using there index number
// const fruits=['Banana','Apple','Mango',"John", "Doe", 46,"Saab", "Volvo", "BMW",1,2,3,4,5,6,7,8,10,'Cat','Cow','Crow'];

// let x=fruits.at(-5);
// console.log(x);


// JavaScript Array join()

// const txt1=["This","is","my","world"];
// const txt2=[".And", "this", "is", "so" ,"beautiful"];
// let add=txt1.join(" ") + txt2.join(" ");  //firstly join() method apply in the first array and convert it in string and then use + operator to adding to element. and then the join() method apply second array  to convert it in string;
// console.log(typeof add);


// const arr1=["Apple","Banana","Mango"];
// let str=arr1.join(" ");
// console.log(typeof str);

// JavaScript Array join()


//Array pop() and array push();

// const fruits=['Banana','Apple','Mango'];
// let fruit=fruits.pop();
// console.log(fruits);
// console.log(fruit);
// let add=fruits.push(fruit);
// console.log(add);
// console.log(fruits);


//Array shift() and array unshift();

// const fruits=['Banana','Apple','Mango'];
// let fruit=fruits.shift();
// console.log(fruits);
// console.log(fruit);
// let add=fruits.unshift(fruit);
// console.log(add);
// console.log(fruits);




// Array concat()



// const x=['This is my world'];
// const y=['This is so Beautiful'];

// let z=x.concat(y);
// console.log(z);




//Array CopyWithin(target,start,end) method

//target=5,
//start=1,
//end=2,

//target=9,*target means that which position i keep my copying element 
//start=1,*start means that which position i want start copy
//end=4,*end means that which position i end my copying.

//target=3
//start=0
//end=take defaults array.length

//target= -5,
//start= -6,
//end=  -4

        //    0         1        2        3       4       5
// const fruits=[ 'Banana', 'Apple', 'Mango', "John", "Doe","Saab", "Volvo",
//  "BMW",'Cat','Cow','Crow'];

// const fruit=fruits.copyWithin(5,1,2);
// const fruit1=fruits.copyWithin(9,1,10);
// const fruit=fruits.copyWithin(-5,-6,-4);
// console.log(fruit);
// console.log(fruits);


//Array flat() method

// const arr=[['a','b'],['c','d'],['e']];
// let arr1=arr.flat();
// console.log(arr1);
// console.log(arr);


// Array splice()

// const fruits=['Banana', 'Apple', 'Mango', "John", "Doe","Saab", "Volvo",
// "BMW",'Cat','Cow','Crow'];

// let arr=fruits.splice(3,2,'Lemon','Kiwi');
// let x=arr.toString();
// console.log(x);
// let arr1=fruits.splice(3,0,x);
// console.log(arr1);
// console.log(fruits);

//Array toSpliced()

// const fruits=['Banana', 'Apple', 'Mango', "John", "Doe","Saab", "Volvo",
// "BMW",'Cat','Cow','Crow'];

// let fruit=fruits.toSpliced(0,1);
// console.log(fruit);
// console.log(fruits);


//Array Slice();

// const fruits=['Banana', 'Apple', 'Mango', "John", "Doe","Saab", "Volvo",
// "BMW",'Cat','Cow','Crow'];

// let notFruit=fruits.slice(3);

// console.log(notFruit);
// console.log(fruits);


//Array Slice();
// const fruits=['Banana', 'Apple', 'Mango', "John", "Doe","Saab", "Volvo",
// "BMW",'Cat','Cow','Crow'];

// const fruit=fruits.slice(0,3);
// console.log(fruit);


//Slice out the animal name
// const animal = fruits.slice(-3);
//const animal = fruits.slice(-3,11);//negative value diye kaj korte hole obboshoi kheyal rakhte hobe je index amon vabe likhte hobe jate count korar somoy jate left thake right hoy and second index er value first er pore dite hobe.jate kore left thake count suru hole jate protome first slice and pore jate second slice hoy tahole kaj korbe onnotai kaj korbe nh

// console.log(animal);






// indexOf()

// When using indexOf() on an array, it searches for a specific value within the array. If the value is found, it returns the index of the first occurrence of that value in the array.

// let x = ['Apple','Mango','Lemon','Kiwi','Lemon'];
// let y = x.indexOf('Lemons');
// console.log(y);

// lastIndexOf();

// ECMAScript 2016 introduced Array.includes() to arrays. This allows us to check if an element is present in an array (including NaN, unlike indexOf).

//Array.includes() allows to check for NaN values. Unlike Array.indexOf().

// let y = x.includes("Mangos");
// console.log(y);




// let x = ['Apple','Mango','Lemon','Kiwi','Mango','Apple','Lichi','Orange','Banana','Apple'];

// let y = x.lastIndexOf('Apple')+1;
// console.log(y);


// let x = ['Apple','Mango','Lemon','Kiwi','Mango','Apple','Lichi','Orange','Banana','Apple'];



// const fruits = function (value){
//         return value === 'Kiwi';
// }

// let y = x.find(fruits);
// console.log(y);



//findIndex()
//The findIndex() method returns the index of the first array element that passes a test function.

// let x = ['Apple','Mango','Lemon','Kiwi','Mango','Apple','Lichi','Orange','Banana','Apple'];

//let y = x.findIndex(item => item === 'Apple');
//console.log(y); // This will log the index of the first occurrence of 'Apple' in the array

//find()
//The find() method returns the value of the first array element that passes a test function.

// const x = [1,2,3,4,5,6,7,8,9];
// let y = x.find(numbers);


// function numbers (value){
//       return  value > 5
// }
// console.log(y);

//findLast()

//findLast() method that will start from the end of an array and return the value of the first element that satisfies a condition.

// let x = [1,2,3,4,5,6,7,8,9];

// let y =x.findLast(numbers);

// function numbers (value){
//         return value > 2;
// }

// console.log(y);


//findLastIndex();

//findLastIndex() method that will start from the end of an array and return the index number of that value which i want to know and return the index number of first element index number that satisfies a condition.


// const x = [1,2,3,4,5,6,7,8,9,10];

// // console.log(Math.max(...x));
// let y = x.findLastIndex(numbers)+1;

// function numbers (value){
//         return value < 5;
// }

// console.log(typeof y);


//sort()

//The sort() method sorts an array alphabetically:

// const fruit = [2,11,8,4,5,12,6,3,6,7,9,1];
// console.log(fruit);

// const fruit = ['Apple','Mango','Lemon','Kiwi','Mango','Apple','Lichi','Orange','Banana','Apple'];

// const fruit = [9,2,5,6,8,4,7,1,3];

// let fruits = fruit.sort();
// console.log(fruits);
// console.log(fruit);

//reverse();
//The reverse() method reverses the elements in an array:
//The reverse() method reverses the elements in an array:
// const fruit = ['Apple','Mango','Lemon','Kiwi','Mango','Apple','Lichi','Orange','Banana','Apple'];

// let fruits = fruit.reverse();
// console.log(fruits);
// console.log(fruit);


//sort() and reverse() combine
//By combining sort() and reverse(), you can sort an array in descending order.
// const fruits = ["Banana", "Orange", "Apple", "Mango"];
// let y= fruits.sort();
// let z=y.reverse();

// console.log(y);
// console.log(z);


// const x = ['9','2','5','11','6','12','8','13','22','4','7','1','21','3'];
// const x = ['100','25'];
// let y = x.sort();
// console.log(y);


//toSorted()
//toSorted() method as a safe way to sort an array without altering the original array.
// const fruits = ["Banana", "Orange", "Apple", "Mango"];
// let x = fruits.toSorted();
// console.log(x);


//toReversed()
// toReversed() method as a safe way to reverse an array without altering the original array.
// const fruits = ["Banana", "Orange", "Apple", "Mango"];
// let y = fruits.toReversed();
// console.log(y);



// const fruits = ["Banana", "Orange", "Apple", "Mango"];
// let x = fruits.toSorted();
// let y = x.toReversed();
// console.log(y);
// console.log(fruits);


// If the result is negative, a is sorted before b.

// If the result is positive, b is sorted before a.

// const points = [10,3,4,7,8,9,2,1,5,6];

// let y = points.sort(function (a,b){
//         return a-b;
// });
// console.log(y);



//(b-a)

// The sort function looks at two numbers at a time.
// It uses the function(a, b){return b - a} part to decide which number should come first.
// If b - a is positive (greater than 0), it means b is bigger, so b should come before a.
// If b - a is negative (less than 0), it means a is bigger, so a should come before b.

// const points = [10,3,4,7,8,9,2,1,5,6];

// let y = points.sort(function(a,b){
        // return b-a;
// })
// console.log(y);

//Using a sort function, like explained above, you can sort an numeric array in random order
// const points = [10,3,4,7,8,9,2,1,5,6];


// let y = points.sort(function(){
        // return 0.5 - Math.random();
// });

// console.log(y);


// const points = [40, 100, 1, 5, 25, 10];

// function myFunction() {
//         for (let i = points.length -1; i > 0; i--) {
//           let j = Math.floor(Math.random() * (i+1));
//           let k = points[i];
//           points[i] = points[j];
//           points[j] = k;
//         }
// }





// console.log(points.length);

// let i = points.length-1;
// console.log(i);

// let j = Math.floor(Math.random()*(i+1));
// console.log(j);

// console.log(i);

// const points = [40, 100, 1, 5, 25, 10];

// for (let i = points.length -1; i > 0; i--) {
//   let j = Math.floor(Math.random() * (i+1));
//   let k = points[i];
//   points[i] = points[j];
//   points[j] = k;
// }

// const points = [40,100,1,5,25,10];


//let i = points.length.-1;ai line ti dara bujai je i er value hobe points array er joto gulu value ase tar modde last er index number joto toto boshbe ortata jehetu javaScript count korah 0 thake suru hoy tay.ortat akti array te 10 element thakle tokhon 0 thake count suru korle dekha jabe je 0 thake 9 porjonto ai total 10 ti .ortat javaScript er moto jate count korah jai tay point.length-1 deya hoyeche.
//i>0=ai line ti dara bujai je jotokhon nh i er value 0 thake chuto hoy toto khon loop gurte thakbe.
//i--.ai line ti dara bujai je proti bar loop gorar por 1 kore value komano
// function myFunction(){
//         for(let i=0;i<points.length;i++){
//                 let j = Math.floor(Math.random()*(i+1));//ai line ti dara bujai je math.random akti number dibe oi number er shate i+1 gun hobe.and math.floor use kora hoyeche jate kono dosomik songkha nh ashe .
//                 let k = points[i];//ai line ti dara point[i] index a value ache oita ke k name varibale store kore rakhbe
//                 points[i]=points[j];//ai line dara bujai je suffle korar jonno.oratat aikhane i er value er shate j er value shate stan bodol korar jonno.jate kore suffle kora jai
//                 points[j]=k; //ai line ti dara bujai je j er value ke kl name variable e store kore rakha.
//                 console.log(`k =========>`+k);
                
//         }
// };
// console.log(points);

// myFunction();
// console.log(points);

// let x = myFunction();
// console.log(x);


//find the lowest number in the array;
// const points = [40,100,1,5,25,10];

// let y = points.sort(function (a,b){
//         return a-b;
// });
// console.log(y[0]);


// console.log(points[0]);

//find the highest number in the array
// const points = [40,100,1,5,25,10];

// let y = points.sort(function(a,b){
//         return b-a;
// });
// console.log(points[0]);

// console.log(y[0]);

//find lowest number in the array using Math.min.apply();

// const points = [40,100,1,5,25,10];

// function myFunction(arr){
//         return Math.min.apply(null , arr);
// }
// let y=myFunction(points)
// console.log(y);

// const cars = [
//         {type:"Volvo", year:2016},
//         {type:"Saab", year:2001},
//         {type:"BMW", year:2010}
//     ];
    
//     function myFunction() {
//         cars.sort(function(a, b){
//             let x = a.type.toLowerCase();
//             let y = b.type.toLowerCase();
//             if (x < y) {return -1;}
//             if (x > y) {return 1;}
//             return 0;
//         });
//         displayCars();
//     }
    
//     function displayCars() {
//         console.log(cars[0].type + " " + cars[0].year);
//         console.log(cars[1].type + " " + cars[1].year);
//         console.log(cars[2].type + " " + cars[2].year);
//     }
    
//     myFunction();
    


// What It Means
// ES2019 Revised the Array sort() Method:
// In 2019, a new rule (called ES2019) changed how the sort() method works in JavaScript.
// Before 2019:
// Before this change, browsers could use different ways to sort arrays. Some of these ways were called “unstable sorting algorithms” like QuickSort.
// After ES2019:
// After the change in 2019, browsers must use a “stable sorting algorithm” when sorting arrays.
// What is a Stable Sorting Algorithm?
// Stable Sorting:
// When you sort items that have the same value, a stable sorting algorithm keeps their original order.
// For example, if you have two items with the same price, they will stay in the same order they were in before sorting.
// Example to Understand
// Imagine you have a list of students with their names and grades:

// JavaScript

// const students = [
//   {name: "Alice", grade: 90},
//   {name: "Bob", grade: 90},
//   {name: "Charlie", grade: 85}
// ];
// Basic development code blocks. Review and use carefully. More info on FAQ.
// If you sort by grade, both Alice and Bob have the same grade (90).
// With a stable sort, Alice will stay before Bob because she was first in the original list.
// Why It Matters
// Before 2019: The order of Alice and Bob might change because the sorting method wasn’t stable.
// After 2019: The order of Alice and Bob will stay the same because the sorting method is stable.
// Summary
// Before 2019: Sorting could change the order of items with the same value.
// After 2019: Sorting keeps the order of items with the same value.



    const myArr = [
        {name:"X00",price:100 },
        {name:"X01",price:100 },
        {name:"X02",price:100 },
        {name:"X03",price:100 },
        {name:"X04",price:110 },
        {name:"X05",price:110 },
        {name:"X06",price:110 },
        {name:"X07",price:110 },
        {name:"X08",price:120 },
        {name:"X09",price:120 },
        {name:"X10",price:120 },
        {name:"X11",price:120 },
        {name:"X12",price:130 },
        {name:"X13",price:130 },
        {name:"X14",price:130 },
        {name:"X15",price:130 },
        {name:"X16",price:140 },
        {name:"X17",price:140 },
        {name:"X18",price:140 },
        {name:"X19",price:1 }
      ];


myArr.sort(function (a,b){
        if(a.price < b.price){
                return -1;
        }else if(a.price > b.price){
                return 1;
        }else{
                return 0
        }
});

myArr.forEach(myFunction)

function myFunction (value){
        console.log( value.name + " " + value.price);
        
}