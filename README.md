# labyrinth-backtracking

Live Demo of the project : https://d-roduit.github.io/labyrinth-backtracking/

## Fun little algorithm challenge :

Here is a matrix of numbers that will be our labyrinth:

|-1|-1|-1|-1|-1|-1|4|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|
|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|-1|-1|-1|-1|-1|1|7|9|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|
|-1|-1|-1|3|2|6|10|12|14|16|4|8|10|12|-1|-1|-1|-1|-1|-1|
|-1|-1|4|1|5|9|11|13|15|19|21|13|15|2|5|-1|-1	|-1|-1|-1|
|-1|-1|5|4|8|12|12|16|14|16|16|18|4|7|10|12|-1|-1|-1|-1|
|-1|-1|2|7|7|11|15|17|19|19|21|23|9|13|15|15|18|-1|-1|-1|
|-1|-1|6|2|10|12|10|14|18|22|24|26|14|18|18|20|22|24|-1|-1|
|-1|-1|9|8|13|15|13|11|15|17|27|19|21|23|19|23|23|27|-1|-1|
|-1|-1|12|11|11|12|16|18|20|20|22|24|24|26|22|24|26|28|-1|-1|
|-1|-1|15|14|16|15|17|13|17|21|25|21|25|29|25|27|27|31|-1|-1|
|-1|-1|18|22|14|18|12|16|2|6|10|24|20|24|28|30|2|4|-1|-1|
|-1|-1|21|25|25|11|15|0|3|9|15|19|23|25|3|5|7|7|-1|-1|
|-1|20|24|28|30|32|0|4|8|12|14|16|18|4|8|12|10|12|14|-1|
|19|23|25|29|33|0|3|7|11|13|17|11|13|15|13|17|19|21|17|19|
|-1|26|28|30|34|2|6|10|12|16|14|16|18|20|20|22|18|20|22|-1|
|-1|-1|29|33|1|5|7|11|15|17|19|19|19|23|25|25|23|25|-1|-1|
|-1|-1|32|0|4|2|4|6|18|11|13|17|22|22|28|30|28|30|-1|-1|
|-1|-1|-1|3|0|3|7|9|11|13|16|21|25|27|29|33|35|-1|-1|-1|
|-1|-1|-1|-1|-1|-1|-1|-1|14|16|20|-1|-1|-1|-1|-1|-1|-1|-1|-1|
|-1|-1|-1|-1|-1|-1|-1|-1|-1|19|-1|-1|-1|-1|-1|-1|-1|-1|-1|-1|


**Beginning:**
You start at box of index `matrix[0][6]` which contains the value 4.

**Goal:**
Find the possible path(s) to arrive on a box of value 19 located on any of the matrix's edges (here, there are 3 possible exits: south, west and east) to get out of the labyrinth.

**Rules:**
To go through the labyrinth (that is to say, to move from one box to another), you must follow these simple rules: from any box, you can only move:
- to the right one by adding 2,
- to the one below by adding 3,
- to the left one by subtracting 4,
- to the one above by subtracting 5.

Of course, one cannot move to a box without having the right value !

> **Exemple:**
>
> If we had the following matrix:
>
>|1|3|7|
>|-|-|-|
>|6|2|4|
>|0|5|9|
>
> 
> and we were on the box with value 2:
> 
> we could move:
> - to the right (because 2 + 2 == 4)
> - below (because 2 + 3 == 5)
>
> we could NOT move:
> - to the left (because 2 - 4 != 6)
> - above (because 2 - 5 != 3)



The labyrinth is a 20x20 matrix.<br>
The value -1 means that the square is inaccessible.
