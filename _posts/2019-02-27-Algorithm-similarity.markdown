---
layout:     post
title:      相似度测定的一些基本原则调研
subtitle:   "算法思考"
date:       2019-02-27 14:44:00
author:     "Wp.Zhang"
header-img: "img/post-bg-2015.jpg"
tags:
    - Algorithm
---
### 题目：调研相似度测定的一些基本原则
---
>比较两个不同样本之间的相似度的常用方法是计算样本之间的距离、相似度。

#### 1. 欧氏距离
&#160; &#160; &#160; &#160;这是我们熟知的计算距离的方法：n维向量的两点a(x11,x12,…,x1n)与 b(x21,x22,…,x2n)，欧氏距离为：
<div align=center>![](/media/editor/20170331224407185_20190227224702134418.png)</div>

#### 2. 曼哈顿距离
&#160; &#160; &#160; &#160;也称城市街区距离，与计算十字路口之间的距离方法相同：两个n维向量a(x11,x12,…,x1n)与 b(x21,x22,…,x2n)间的曼哈顿距离为：
<div align=center>![](/media/editor/2011030823231354_20190227231043061106.png)</div>

#### 3. 切比雪夫距离
&#160; &#160; &#160; &#160;两个n维向量a(x11,x12,…,x1n)与 b(x21,x22,…,x2n)间的切比雪夫距离：
<div align=center>![](/media/editor/2011030823235870_20190227231612660233.png)</div>

#### 4. 皮尔逊相关系数
&#160; &#160; &#160; &#160;在自然科学领域中，该系数广泛用于度量两个变量之间的相关程度。在 欧几里得空间中,假设存在两个 x, y 的 n 维向量，则皮尔逊相关系数计算公式如下：
<div align=center>
<img src="http://latex.codecogs.com/png.latex?r=%5Cfrac%7B%5Csum_%7Bi=1%7D%5En(x_i-%5Cbar%7Bx%7D)(y_i-%5Cbar%7By%7D)%7D%7B%7B%5Csqrt%7B%5Csum_%7Bi=1%7D%5En(x_i-%5Cbar%7Bx%7D)%5E2%7D%7D%7B%5Csqrt%7B%5Csum_%7Bi=1%7D%5En(y_i-%5Cbar%7By%7D)%5E2%7D%7D%7D" data-original-src="http://latex.codecogs.com/png.latex?r=%5Cfrac%7B%5Csum_%7Bi=1%7D%5En(x_i-%5Cbar%7Bx%7D)(y_i-%5Cbar%7By%7D)%7D%7B%7B%5Csqrt%7B%5Csum_%7Bi=1%7D%5En(x_i-%5Cbar%7Bx%7D)%5E2%7D%7D%7B%5Csqrt%7B%5Csum_%7Bi=1%7D%5En(y_i-%5Cbar%7By%7D)%5E2%7D%7D%7D" style="cursor: zoom-in;"></div>

#### 5.余弦相似度
&#160; &#160; &#160; &#160;通过测量两个向量的夹角的余弦值来度量它们之间的相似性。0度角的余弦值是1，而其他任何角度的余弦值都不大于1；并且其最小值是-1。
&#160; &#160; &#160; &#160;在信息检索中，每个词项被赋予不同的维度，而一个文档由一个向量表示，其各个维度上的值对应于该词项在文档中出现的频率。余弦相似度因此可以给出两篇文档在其主题方面的相似度。
&#160; &#160; &#160; &#160;x, y对应于欧式空间中两个向量，则余弦相似度的计算公式如下：

<div align=center><img src="http://latex.codecogs.com/png.latex?%5Ccos(x,y)=%5Cfrac%7Bx%5Ccdot%7By%7D%7D%7B%7Cx%7C%5Ctimes%7Cy%7C%7D=%5Cfrac%7B%5Csum_%7Bi=1%7D%5Enx_iy_i%7D%7B%5Csqrt%7B%5Csum_%7Bi=1%7D%5En(x_i)%5E2%7D%5Csqrt%7B%5Csum_%7Bi=1%7D%5En(y_i)%5E2%7D%7D" data-original-src="http://latex.codecogs.com/png.latex?%5Ccos(x,y)=%5Cfrac%7Bx%5Ccdot%7By%7D%7D%7B%7Cx%7C%5Ctimes%7Cy%7C%7D=%5Cfrac%7B%5Csum_%7Bi=1%7D%5Enx_iy_i%7D%7B%5Csqrt%7B%5Csum_%7Bi=1%7D%5En(x_i)%5E2%7D%5Csqrt%7B%5Csum_%7Bi=1%7D%5En(y_i)%5E2%7D%7D" style="cursor: zoom-in;"></div>

#### 6.修正余弦相似度
&#160; &#160; &#160; &#160;考虑到用户的评分尺度问题，比如在评分为[1, 5]之间，有的用户即使很是喜欢，但是其给的评分依旧不会很高，同理即使很不喜欢给的评分也不会很低，所以通过减去用户对项评分的均值，修正的余弦相似性度量方法改善了以上问题。
&#160; &#160; &#160; &#160;计算公式如下：

<div align=center><img src="http://latex.codecogs.com/png.latex?s(i,j)=%5Cfrac%7B%5Csum_%7Bu%5Cin%7BU%7D%7D(R_%7Bu,i%7D-%5Cbar%7BR_u%7D)(R_%7Bu,j%7D-%5Cbar%7BR_u%7D)%7D%7B%5Csqrt%7B%5Csum_%7Bu%5Cin%7BU%7D%7D(R_%7Bu,i%7D-%5Cbar%7BR_u%7D)%5E2%7D%5Csqrt%7B%5Csum_%7Bu%5Cin%7BU%7D%7D(R_%7Bu,j%7D-%5Cbar%7BR_u%7D)%5E2%7D%7D" data-original-src="http://latex.codecogs.com/png.latex?s(i,j)=%5Cfrac%7B%5Csum_%7Bu%5Cin%7BU%7D%7D(R_%7Bu,i%7D-%5Cbar%7BR_u%7D)(R_%7Bu,j%7D-%5Cbar%7BR_u%7D)%7D%7B%5Csqrt%7B%5Csum_%7Bu%5Cin%7BU%7D%7D(R_%7Bu,i%7D-%5Cbar%7BR_u%7D)%5E2%7D%5Csqrt%7B%5Csum_%7Bu%5Cin%7BU%7D%7D(R_%7Bu,j%7D-%5Cbar%7BR_u%7D)%5E2%7D%7D" style="cursor: zoom-in;"></div>

>其中，U表示所有对 i 和 j 进行过评级的用户组成的集合