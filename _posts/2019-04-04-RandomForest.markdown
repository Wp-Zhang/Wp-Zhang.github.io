---
layout:     post
title:      随机森林算法梳理
subtitle:   ""
date:       2019-04-04 13:25:00
author:     "Wp.Zhang"
header-img: "img/post-bg-2015.jpg"
tags:
    - Machine Learning
    - Data Science
---
# 随机森林算法梳理

## 集成学习和个体学习器概念

&nbsp; &nbsp; &nbsp; &nbsp; 集成学习(ensembel learning)通过构建并结合多个学习器来完成学习任务。集成学习的一般结构为：先产生一组个体学习器(individual learner)再用某种策略将它们结合起来。集成方法(ensemble method)的目标是：与包含于其中的单个分类器相比，集合而成的元分类器具有更好的泛化性能。通过集成学习得到的结果具有更好的准确性和鲁棒性。这一效果在个体学习器是弱学习器时更加明显。

&nbsp; &nbsp; &nbsp; &nbsp; 个体学习器通常由一个现有的学习算法从训练数据产生，例如C4.5决策树算法、BP神经网络算法等。集成学习可以细分为同质集成和异质集成：同质集成中只包含同种类型的个体学习器（此时也称为“基学习器”），如“决策树集成”和“神经网络集成”；异质集成中的个体学习器由不同的学习算法生成。

## Boosting和Bagging

### Boosting

&nbsp; &nbsp; &nbsp; &nbsp; Boosting是一族可以将弱学习器提升为强学习器的算法。工作机制基本为：先从初始训练集训练出一个基学习器，再根据基学习器的表现对训练样本分布进行调整，使得先前基学习器做错的训练样本在后续受到更多关注，然后基于调整后的样本分布来训练下一个基学习器；如此重复执行直到基学习器达到事先指定的值T，最终将这T个基学习器进行加权结合。

&nbsp; &nbsp; &nbsp; &nbsp; Boosting族算法最常见的是AdaBoost。AdaBoost是Adaptive Boosting的缩写。算法运行过程中：每个训练样本被赋予一个相等的初始权重，每次训练完成后分错的样本的权重将会提高，分对的样本的权重降低，且每个分类器也有根据其分类错误率计算出的权值alpha。

&nbsp; &nbsp; &nbsp; &nbsp; 错误率：<img src="http://latex.codecogs.com/gif.latex?%5Cvarepsilon%20%3D%20%5Cfrac%7Bwrong%5C_split%5C_sample%7D%7Bsample%5C_num%7D"> 
&nbsp; &nbsp; &nbsp; &nbsp; alpha: <img src="http://latex.codecogs.com/gif.latex?%5Calpha%20%3D%20%5Cfrac%7B1%7D%7B2%7D%20%5Cln%5Cleft%28%5Cfrac%7B1-%5Cvarepsilon%7D%7B%5Cvarepsilon%7D%20%5Cright%29">  
&nbsp; &nbsp; &nbsp; &nbsp; 分对的样本权重向量D: <img src="http://latex.codecogs.com/gif.latex?D%5E%7B%28t&plus;1%29%7D_i%20%3D%20%5Cfrac%7BD%5E%7B%28t%29%7D_ie%5E%7B-%5Calpha%7D%7D%7BSum%28D%29%7D">  
&nbsp; &nbsp; &nbsp; &nbsp; 分错的样本权重向量D: <img src="http://latex.codecogs.com/gif.latex?D%5E%7B%28t&plus;1%29%7D_i%20%3D%20%5Cfrac%7BD%5E%7B%28t%29%7D_ie%5E%7B%5Calpha%7D%7D%7BSum%28D%29%7D">

&nbsp; &nbsp; &nbsp; &nbsp; 详见[利用AdaBoost元算法提高分类性能](https://ramondz.cn/blog/article/34/)

&nbsp; &nbsp; &nbsp; &nbsp; 从偏差-方差分解的角度看，Boosting主要关注降低偏差，因此它能基于泛化性能很弱的学习器构建出很强的集成。

### Bagging

&nbsp; &nbsp; &nbsp; &nbsp; Bagging是并行式集成学习方法最著名的代表，它直接基于自助采样法：给定包含m个样本的数据集，先随机取出一个样本放入采样集中，再把该样本放回初始数据集，使得下次采样时该样本仍有可能被选中。经过m次随机采样操作就可以得到m个样本的采样集。利用这个方法我们可以采样出T个含m个训练样本的采样集，每个采样集用于训练一个基学习器，再将这些基学习器进行结合。

&nbsp; &nbsp; &nbsp; &nbsp; Boosting与Bagging很相似，但是Bagging中不同的分类器通过串行训练获得。每个新分类器都根据已经训练出的**分类器的性能**来进行训练，而Boosting通过关注被已有分类器**错分的数据**来获得新分类器。Bagging中的分类器权重相等，Boosting中的分类器权重不等，每个权重代表对应分类器在上一轮迭代中的成功度。与标准AdaBoost只适用于二分类任务不同，Bagging能不经修改地用于多分类、回归等任务。

## 结合策略

### 平均法

&nbsp; &nbsp; &nbsp; &nbsp; 对于数值型输出，最常见的结合策略是使用平均法。

- 简单平均法：<img src="http://latex.codecogs.com/gif.latex?H%28x%29%3D%5Cfrac%7B1%7D%7BT%7D%5Csum%5ET_%7Bi%3D1%7Dh_i%28x%29">
- 加权平均法：<img src="http://latex.codecogs.com/gif.latex?H%28x%29%3D%5Csum%5E%7BT%7D_%7Bi%3D1%7Dw_ih_i%28x%29%24%uFF0C%u5176%u4E2D%24w_i">是个体学习器<img src="http://latex.codecogs.com/gif.latex?h_i">的权重，通常要求<img src="http://latex.codecogs.com/gif.latex?w_i%5Cgeqslant0%2C%5Csum%5ET_%7Bi%3D1%7Dw_i%3D1">

&nbsp; &nbsp; &nbsp; &nbsp; 加权平均法可认为是集成学习研究的基本出发点，对给定的基学习器，不同的集成学习方法可视为通过不同的方式来确定加权平均法中的基学习器权重。加权平均法的权重一般是从训练数据中学习得来，但是通常训练样本不够充分或其中有噪声，这将使得学出的权重不完全可靠，容易导致过拟合。因此加权平均法未必一定优于简单平均法。一般来说，在个体学习器性能相差较大时宜使用加权平均法，在个体学习器性能相近时用简单平均法。

### 投票法

&nbsp; &nbsp; &nbsp; &nbsp; 对于分类任务来说，最常见的结合策略是使用投票法。

- 绝对多数投票法：若某标记得票数超过半数则预测结果为该标记，否则**不返回预测结果**  
- 相对多数投票法：在生活中用得最多，预测结果为**得票数最多**的标记
- 加权投票法：与加权平均法类似，每个个体学习器所投的票具有权重，最终预测结果为得票最多的标记

### 学习法

&nbsp; &nbsp; &nbsp; &nbsp; 当训练数据很多时，一种更强大的结合策略是使用学习法，即通过另一个学习器来进行结合。Stacking是学习法的典型代表，在实际中也应用的很多。在这里把个体学习器称为初级学习器，用于结合的学习器称为次级学习器或元学习器。

&nbsp; &nbsp; &nbsp; &nbsp; Stacking先从初始数据集训练出初级学习器，然后“生成”一个新数据集用于训练次级学习器。在新数据集中，初级学习器的输出被作为样例输入特征，初始样本的标记仍被作为样例标记。

&nbsp; &nbsp; &nbsp; &nbsp; 在训练阶段，若直接用初级学习器的训练集来产生次级训练集，很容易发生过拟合现象，因此一般通过使用交叉验证或留一法的方式，将训练初级学习器时没有使用的样本来产生次级学习器的训练样本。

## 随机森林思想

&nbsp; &nbsp; &nbsp; &nbsp; 随机森林（Random Forest）是Bagging的一个拓展变体。RF在以决策树为基学习器构建Bagging集成的基础上，进一步在决策树的训练过程中引入了随机属性选择。传统决策树是在当前节点的属性集合（假定有d个）中选择最优属性；在BF中，对及基决策树的每个节点，先从该节点的属性集合中选k个作为属性子集，然后在这个属性子集中选择一个最优属性。

## 随机森林的推广

&nbsp; &nbsp; &nbsp; &nbsp; 

### extra trees

&nbsp; &nbsp; &nbsp; &nbsp;extra trees是RF的一个变种, 原理几乎和RF一模一样，仅有区别有：  
1. 对于每个决策树的训练集，RF采用的是随机采样bootstrap来选择采样集作为每个决策树的训练集，而extra trees一般不采用随机采样，即每个决策树采用原始训练集。
2. 在选定了划分特征后，RF的决策树会基于基尼系数，均方差之类的原则，选择一个最优的特征值划分点，这和传统的决策树相同。但是extra trees比较的激进，它会随机的选择一个特征值来划分决策树。
3. 从第二点可以看出，由于随机选择了特征值的划分点位，而不是最优点位，这样会导致extra trees生成的决策树的规模一般会大于RF所生成的决策树。也就是说，模型的方差相对于RF进一步减少，但是偏倚相对于RF进一步增大。在某些时候，extra trees的泛化能力比RF更好。

### Totally Random Trees Embedding

&nbsp; &nbsp; &nbsp; &nbsp; Totally Random Trees Embedding(TRTE)是一种非监督学习的数据转化方法。它将低维的数据集映射到高维，从而让映射到高维的数据更好的运用于分类回归模型。在支持向量机中运用了核方法来将低维的数据集映射到高维，此处TRTE提供了另外一种方法。  
&nbsp; &nbsp; &nbsp; &nbsp; TRTE在数据转化的过程也使用了类似于RF的方法，建立T个决策树来拟合数据。当决策树建立完毕以后，数据集里的每个数据在T个决策树中叶子节点的位置也定下来了。比如我们有3颗决策树，每个决策树有5个叶子节点，某个数据特征x划分到第一个决策树的第2个叶子节点，第二个决策树的第3个叶子节点，第三个决策树的第5个叶子节点。则x映射后的特征编码为

<img src="http://latex.codecogs.com/gif.latex?%5Cbegin%7Bpmatrix%7D%200%20%26%201%20%26%200%20%26%200%20%26%200%5C%5C%200%20%26%200%20%26%201%20%26%200%20%26%200%5C%5C%200%20%26%200%20%26%200%20%26%200%20%26%201%20%5Cend%7Bpmatrix%7D" style="float:center;">

有15维的高维特征。  
&nbsp; &nbsp; &nbsp; &nbsp; 映射到高维特征后，可以继续使用监督学习的各种分类回归算法了。

### Isolation Forest

&nbsp; &nbsp; &nbsp; &nbsp; Isolation Forest（IForest）是一种异常点检测的方法。它也使用了类似于RF的方法来检测异常点。  
&nbsp; &nbsp; &nbsp; &nbsp; 对于在T个决策树的样本集，IForest也会对训练集进行随机采样,但是采样个数不需要和RF一样，对于RF，需要采样到采样集样本个数等于训练集个数。但是IForest不需要采样这么多，一般来说，采样个数要远远小于训练集个数,因为其目的是异常点检测，只需要部分的样本一般就可以将异常点区别出来了。  
&nbsp; &nbsp; &nbsp; &nbsp; 对于每一个决策树的建立， IForest采用随机选择一个划分特征（和TRTE类似），对划分特征随机选择一个划分阈值。这点也和RF不同。  
&nbsp; &nbsp; &nbsp; &nbsp; 另外，IForest一般会选择一个比较小的最大决策树深度max_depth,原因同样本采集，用少量的异常点检测一般不需要这么大规模的决策树。  
&nbsp; &nbsp; &nbsp; &nbsp; 对于异常点的判断，则是将测试样本点x拟合到T颗决策树。计算在每颗决策树上该样本的叶子节点的深度ht(x)。，从而可以计算出平均高度h(x)。此时再用下面的公式计算样本点x的异常概率:<img src="http://latex.codecogs.com/gif.latex?s%28x%2Cm%29%3D2%5E%7B-%5Cfrac%7Bh%28x%29%7D%7Bc%28m%29%7D%7D" style="float:center;">
&nbsp; &nbsp; &nbsp; &nbsp; 其中，m为样本个数。c(m)的表达式为：<img src="http://latex.codecogs.com/gif.latex?c%28m%29%3D2%5Cln%28m-1%29&plus;%5Cxi-2%5Cfrac%7Bm-1%7D%7Bm%7D" style="text-align:center;">
&nbsp; &nbsp; &nbsp; &nbsp; ξ为欧拉常数。  
&nbsp; &nbsp; &nbsp; &nbsp; s(x,m)的取值范围是[0,1],取值越接近于1，则是异常点的概率也越大。

## 优缺点

&nbsp; &nbsp; &nbsp; &nbsp; RF主要优点有：
- 训练可以高度并行化，对于大样本有较快的训练速度。
- 由于随机选择决策树节点划分特征，因此在样本特征维度很高的时候仍能高效地训练模型。
- 在训练后可以查看各个特征的贡献值。
- 由于采用了随机采样，因此训练出的模型泛化能力强。
- 相对于Boosting系列的AdaBoost和GBDT，RF实现比较简单。
- 对部分特征缺失不敏感。  
&nbsp; &nbsp; &nbsp; &nbsp; RF主要缺点有：
- 当样本集噪音过大时，RF训练的模型容易过拟合。
- 取值划分较多的特征容易对RF的决策产生更大的影响，从而影响拟合的模型的效果。

##### 参考[Bagging与随机森林算法小节](http://www.cnblogs.com/pinard/p/6156009.html)

## sklearn参数

### 随机森林框架参数

- n_estimators:   
&nbsp; &nbsp; &nbsp; &nbsp; 弱学习器的最大迭代次数，或者说最大的弱学习器的个数。一般来说n_estimators太小，容易过拟合，n_estimators太大，又容易欠拟合，一般选择一个适中的数值。默认是100。在实际调参的过程中，我们常常将n_estimators和参数learning_rate一起考虑。 
  
  
- oob_score:  
&nbsp; &nbsp; &nbsp; &nbsp; 即是否采用袋外样本来评估模型的好坏。默认识False。因为袋外分数反应了一个模型拟合后的泛化能力，所以设置为True可以充分利用这一点。  


- criterion:  
&nbsp; &nbsp; &nbsp; &nbsp; 即CART树做划分时对特征的评价标准。分类模型和回归模型的损失函数是不一样的。分类RF对应的CART分类树默认是基尼系数gini,另一个可选择的标准是信息增益。回归RF对应的CART回归树默认是均方差mse，另一个可以选择的标准是绝对值差mae。一般来说选择默认的标准就已经可以了。

### 随机森林决策树参数

- max_features  
&nbsp; &nbsp; &nbsp; &nbsp; 决策树划分时考虑的最大特征数。可以使用很多种类型的值，默认是”None”,意味着划分时考虑所有的特征数；如果是”log2”意味着划分时最多考虑log2(n_features)个特征；如果是”sqrt”或者”auto”意味着划分时最多考虑sqrt(n_features) 个特征。如果是整数，代表考虑的特征绝对数目。如果是浮点数，代表考虑特征百分比，即考虑$max\_features\times100\times n\_features$取整后的特征数。其中N为样本总特征数。  
&nbsp; &nbsp; &nbsp; &nbsp; 一般来说，如果样本特征数不多，比如小于50，我们用默认的”None”就可以了，如果特征数非常多，我们可以灵活使用刚才描述的其他取值来控制划分时考虑的最大特征数，以控制决策树的生成时间。   
&nbsp; &nbsp; &nbsp; &nbsp; **参数效果：max_features 值越大，模型学习能学习到的信息越多，越容易过拟合。**


- max_depth  
&nbsp; &nbsp; &nbsp; &nbsp; 决策树最大深度max_depth, 默认可以不输入，如果不输入的话，决策树在建立子树的时候不会限制子树的深度。一般来说，数据少或者特征少的时候可以不管这个值。如果模型样本量多，特征也多的情况下，推荐限制这个最大深度，具体的取值取决于数据的分布。常用的可以取值10-100之间。   
&nbsp; &nbsp; &nbsp; &nbsp; **参数效果：值越大，决策树越复杂，越容易过拟合。**


- min_samples_split   
&nbsp; &nbsp; &nbsp; &nbsp; 内部节点再划分所需最小样本数min_samples_split: 这个值限制了子树继续划分的条件，如果某节点的样本数少于min_samples_split，则不会继续再尝试选择最优特征来进行划分。 默认是2.如果样本量不大，不需要管这个值。如果样本量数量级非常大，则推荐增大这个值。  
&nbsp; &nbsp; &nbsp; &nbsp; **参数效果：值越大，决策树越简单，越不容易过拟合。**


- min_samples_leaf   
&nbsp; &nbsp; &nbsp; &nbsp; 叶子节点最少样本数min_samples_leaf: 这个值限制了叶子节点最少的样本数，如果某叶子节点数目小于样本数，则会和兄弟节点一起被剪枝。 默认是1,可以输入最少的样本数的整数，或者最少样本数占样本总数的百分比。如果样本量不大，不需要管这个值。如果样本量数量级非常大，则推荐增大这个值。   
&nbsp; &nbsp; &nbsp; &nbsp; **参数效果：值越大，叶子节点越容易被被剪枝，决策树越简单，越不容易过拟合。**


- min_weight_fraction_leaf   
&nbsp; &nbsp; &nbsp; &nbsp; 叶子节点最小的样本权重和：这个值限制了叶子节点所有样本权重和的最小值，如果小于这个值，则会和兄弟节点一起被剪枝。 默认是0，就是不考虑权重问题。一般来说，如果我们有较多样本有缺失值，或者分类树样本的分布类别偏差很大，就会引入样本权重，这时我们就要注意这个值了。


- max_leaf_nodes   
&nbsp; &nbsp; &nbsp; &nbsp; 最大叶子节点数max_leaf_nodes: 通过限制最大叶子节点数，可以防止过拟合，默认是”None”，即不限制最大的叶子节点数。如果加了限制，算法会建立在最大叶子节点数内最优的决策树。如果特征不多，可以不考虑这个值，但是如果特征分成多的话，可以加以限制，具体的值可以通过交叉验证得到。   
&nbsp; &nbsp; &nbsp; &nbsp; **参数效果：值越小，叶子节点个数越少，可以防止过拟合。**


- min_impurity_split   
&nbsp; &nbsp; &nbsp; &nbsp; 节点划分最小不纯度min_impurity_split: 这个值限制了决策树的增长，如果某节点的不纯度(基于基尼系数，均方差)小于这个阈值，则该节点不再生成子节点。即为叶子节点 。一般不推荐改动默认值1e-7。

上面决策树参数中最重要的包括:  
- 最大特征数max_features  
- 最大深度max_depth  
- 内部节点再划分所需最小样本数min_samples_split  
- 叶子节点最少样本数min_samples_leaf

参考 [随机森林sklearn RandomForest，及其调参](https://blog.csdn.net/geduo_feng/article/details/79558572)

## 应用场景

1. 包含非线性特征
2. 数据集中包含噪声
3. 特征维度较高
4. 数据及规模较大