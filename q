[33mcommit d82c0328df3fde47bb7f21c7183db23e56196fd8[m[33m ([m[1;36mHEAD -> [m[1;32mgh-pages[m[33m)[m
Author: Gra Angh <graangh@gmail.com>
Date:   Tue Apr 27 08:47:58 2021 +0300

    Удаление пустых селекторов

[1mdiff --git a/style/main.css b/style/main.css[m
[1mindex a6092f6..f0a4f8c 100644[m
[1m--- a/style/main.css[m
[1m+++ b/style/main.css[m
[36m@@ -96,17 +96,7 @@[m
     margin-top: 12px;[m
     border-collapse: collapse;[m
 }[m
[31m-/*[m
[31m-.task-root table.info tr:nth-of-type(odd)[m
[31m-{[m
[31m-  [m
[31m-}[m
 [m
[31m-.task-root table.info tr:nth-of-type(even)[m
[31m-{[m
[31m-   [m
[31m-}[m
[31m-*/[m
 .root table.info tr[m
 {[m
     transition: background-color .4s 0s linear;[m
[36m@@ -136,23 +126,6 @@[m
     font-family: monospace;[m
 }[m
 [m
[31m-/*[m
[31m-.root table.info tr:hover[m
[31m-{[m
[31m-    [m
[31m-}[m
[31m-[m
[31m-.root table.info tr:hover td:nth-child(1)[m
[31m-{[m
[31m- [m
[31m-}[m
[31m-[m
[31m-.root table.info tr:hover td:nth-child(2)[m
[31m-{[m
[31m-[m
[31m-}[m
[31m-*/[m
[31m-[m
 /*===========================*[m
  *                           *[m
  *       audio               *[m
