---
title: "Retrieval 02: Swing and Surprise"
date: 2022-05-25 11:22:00
tags: ["Recommender System", "Recommending - Retrieval", "Machine Learning"]
---

There are two very important types of relationships between products: substitute and complementary. Substitute products are those that are interchangeable while complementary products are those that might be purchased in addition. For example, when a user is looking at a T-shirt, substitute products are other different types of T-shirts and complementary products can be shorts, hoodies or jackets. Swing is designed for substitute relationships and Surprise is designed for complementary relationships.

## Swing

The basic idea of Swing is that if user $A$ and user $B$ who both clicked item $i$ also clicked item $j$, then item $i$ and item $j$ are considered similar. The less similar $A$ and $B$ are, i.e. the smaller the number of items bought both by $A$ and $B$ is, the more similar $i$ and $j$ are.

$$
s(i,j) = \sum_{u\in U_i \cap U_j}\sum_{v\in U_i \cap U_j}\frac{1}{\sqrt{|I_u|}} * \frac{1}{\sqrt{|I_v|}} * \frac{1}{\alpha + |I_u \cap I_v|}
$$

$\frac{1}{\sqrt{|I_u|}}$ and $\frac{1}{\sqrt{|I_v|}}$ are weights to reduce the impact of active users and $\alpha$ is the smoothing factor.

## Surprise

### Category-level

The probability of $c_j$ is a related category for $c_i$ is defined as:

$$
\theta_{i,j} = p(c_{i,j}|c_j) = \frac{N(c_{i,j})}{N(c_j)}
$$

where $N_{c_j}$ is the total purchases in category $c_j$, and $N_{c_{i,j}}$
is the number of times $c_j$ is purchased after $c_i$.

### Product-level

For each top related category, we can find top related products by:

$$
s_1(i,j) = \frac{\sum_{u\in U_i \cap U_j} 1/(1+t_{uj} - t_{ui})}{|U_i|\times |U_j|}
$$

where $t_{ui}$ and $t_{uj}$ denote the time that user $u$ bought item $i$ and item $j$. As the order in the product pairs is important, e.g. we can recommend phone cases to a user who just bought a new phone but we shouldn't recommend phones to the user who just bought a new phone case, thus $t_{uj} \ge t_{ui}$.

### Cluster-level

Since the item-level user co-purchasing data is extremely sparse, we can calculate the relevance score for items at the cluster level to alleviate this problem.

Let $L(i)$ denote the cluster that item $i$ belongs to, which is calculated by the relevance score of items from Swing. Then the cluster-level relevance score can be calculated by:

$$
s_2(i,j) = s_1(L(i), L(j))
$$

### Compute Surprise score

The final Suprise score of a product pair is:

$$
s_{i,j} = \omega * s_1(i,j) + (1 - \omega) * s_2(L(i),L(j))
$$

where $\omega$ is the mannually set combination weight.

## References

[1] Xiaoyong Yang et al. ["Large Scale Product Graph Construction for Recommendation in E-commerce."](https://arxiv.org/pdf/2010.05525.pdf) ArXiv, abs/2010.05525.

[2] Ruyi Luo et al. [FunRec - Swing](https://datawhalechina.github.io/fun-rec/#/ch02/ch2.1/ch2.1.1/Swing)
