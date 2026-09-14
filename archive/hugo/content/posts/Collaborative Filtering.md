---
title: "Retrieval 01: Collaborative Filtering"
date: 2022-05-15 23:55:00
tags: ["Recommender System", "Recommending - Retrieval", "Machine Learning"]
---

## UserCF

UserCF uses ratings of the target item from top N similar users to predict the rating from the current user. There are mainly two steps:

### Steps

#### 1. Calculate similarities between users. 

There are three common ways of calculating user similarities:

a. Jaccard Similarity:
$$J_{u,v} = \frac{|N(u) \cap N(v)|}{|N(u) \cup N(v)|}$$
$N(u)$ denotes the interacted item set of user $u$.

b. Cosine Similarity:
$$cos(u,v) = \frac{u\cdot v}{|u|\cdot|v|}$$
$u$ and $v$ denote the rating vectors of two users respectively.

c. Pearson Correlation Coefficient:
$$Pearson_{u,v} = \frac{\sum_i(r_{ui} - \overline r_u)(r_{vi} - \overline r_v)}{\sqrt{\sum_i (r_{ui} - \overline r_u)^2} \sqrt{\sum_i (r_{vi} - \overline r_v)^2}}$$
$r_{ui}$ denotes rating of item $i$ from user $u$ and $\overline r_u$ denotes the average rating of user $u$.
Compared with Cosine Similarity, Pearson Correlation Coefficient subtracts users' ratings by their average rating to reduce the effect of users' rating biases.


#### 2. Use ratings from the top N similar users to predict the rating from the current user.

The equation of calculating predicted rating of item $p$ by user $u$ is:

$$R_{u,p} = \frac{\sum_{s \in S}sim_{s,u} \cdot R_{s,p}}{\sum_{s \in S}sim_{s,u}}$$

Similar to Pearson Correlation Coefficient, we can further reduce the effect of users' rating biases by substracting each user's ratings by his/her average rating:

$$R_{u,p} = \overline R_u + \frac{\sum_{s \in S}sim_{s,u} \cdot (R_{s,p} - \overline R_s)}{\sum_{s \in S}sim_{s,u}}$$

Finally, after ranking $R_{u,p}$ for all possible items $p$, we can recommend the top k items to the current user.


### Analysis

- When the number of items is large, the overlap between the interaction histories of two users will be so small that it's hard to calculate the similarity between them.
- UserCF requires maintaining a super large user similarity matrix to get the top N similar users fast which is extremely space consuming.
- UserCF is more suitable when the number of users is small and the number of items is large. As it is based on user similarity, it can help users to find their potential interests. Thus it may perform better when the interests of users change quickly, e.g. in the context of news recommendations.

---

## ItemCF

ItemCF recommends the top N similar items of the current item based on user historical behaviors, i.e. recommends the items that were usually bought by the user who also bought the current item.

### Steps

#### 1. Calculate similarities between items. 

Similar to UserCF, we can use Cosine Similarity and Pearson Correlation Coefficient to calculate the similarity between two items. 

Also, we can use a simpler equation 
$sim_{p,q} = \frac{|N(p) \cap N(q)|}{|N(p)|}$
to calculate the similarity, where $N(p)$ denotes the set of users who bought item $p$.

#### 2. Calculate ratings of related items and recommend the top K of them.

The predicted rating of current item $p$ by user $u$ can be calculated by:

$$R_{u,p} = \overline R_p + \frac{\sum_{q\in S}sim_{p,q}(R_{u,q} - \overline R_{q})}{\sum_{q\in S}sim_{p,q}}$$

where S denotes the set of top N similar items of item $p$.

### Optimize the similarity equation

We'll take the simple similarity equation $sim_{p,q} = \frac{|N(p) \cap N(q)|}{|N(p)|}$ as an example.

#### Add penalties for popular items

$$sim_{p,q} = \frac{|N(p) \cap N(q)|}{\sqrt{|N(p)|\cdot |N(q)|}}$$

The more popluar an item is, the more penalty it will get.

#### Control penalties for popular items

$$sim_{p,q} = \frac{|N(p) \cap N(q)|}{|N(p)|^{1-\alpha}\cdot |N(q)|^\alpha}$$

We can introduce a hyperparameter $\alpha$ to control the penalties for popular items.

#### Add penalties for extremely active users

$$sim_{p,q} = \frac{1}{|N(p)|^{1-\alpha}\cdot |N(q)|^\alpha}\sum_{u \in {N(p) \cap N(q)}} \frac{1}{\log (1+|I(u)|)}$$

$I(u)$ here denotes the set of items bought by user $u$. For an unusually active user, his/her contribution should be less than that of an inactive user when calculating the similarity between items.

### Analysis

- ItemCF is more suitable when the number of items is small and the number of users is large and users' interests are stable, e.g. movie and music recommendations.

## Conclusion

- One of the pros of Collaborative Filtering is that it only requires user-item interaction history as input. However, it's also one of the cons because it cannot utilize other items and user features.
- Popular items are likely to be similar to a large number of items, while tail items are rarely recommended due to sparse interactive vectors.

---

## References

[1] Ruyi Luo et al. [FunRec - UserCF](https://datawhalechina.github.io/fun-rec/#/ch02/ch2.1/ch2.1.1/usercf)

[2] Ruyi Luo et al. [FunRec - ItemCF](https://datawhalechina.github.io/fun-rec/#/ch02/ch2.1/ch2.1.1/itemcf)

[3] Ruyi Luo et al. [FunRec - Swing](https://datawhalechina.github.io/fun-rec/#/ch02/ch2.1/ch2.1.1/Swing)
