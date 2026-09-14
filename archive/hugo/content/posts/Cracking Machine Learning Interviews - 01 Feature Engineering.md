---
title: "Cracking Machine Learning Interviews - 01 Feature Engineering"
date: 2022-05-15 21:40:00
tags: ["Interview", "Machine Learning"]
description: "My note of reading 百面机器学习(The Quest for Machine Learning). Daily Update."
---

### 1. Why do we need to apply normalization to numerical features?

There are two common ways of normalization:

a. Min-Max Scaling

$$X_{norm} = \frac{X-X_{min}}{X_{max}-X_{min}}$$

This method can scale the data into a range of \[0,1\).

b. Z-Score Normalization

$$z = \frac{x-\mu}{\rho}, \quad \rho=\sqrt{\sum\frac{(x_i-\mu)^2}{N}}$$

This method will scale the data and make the mean value and standard deviation of the new data become 0 and 1 respectively.

When the scales of features are different, the gradients of weights of features can be very different, leading to a different 'learning pace' of each weight, shown as a zig-zag on the gradient plot. Scaling features can make the 'learning pace' of each weight become closer and let the model converge faster.

Scaling the features can be useful when the model uses gradient descent to update the parameters. Otherwise, it may not make a difference, e.g. when the model is a decision tree. 


### 2. How do we handle categorical features?

We can use Ordinal Encoding, One-hot Encoding, and Binary Encoding based on the categorical feature itself. In deep learning, we can learn an embedding representation of a categorical feature, which can be seen as an advanced way of One-hot Encoding and Binary Encoding.

We can further encode categorical features with other features, e.g. statistical values of numerical features of each category, and target encoding.

### 3. What is Feature Intersection? How do we intersect high-dimensional features?

We can intersect different features and generate new features to improve the fitting ability of our model.

For high-dimensional features, we can first represent them in lower dimensions and then intersect them. A typical case is, in the context of recommendation, using matrix factorization to represent users and items in lower dimension vectors and then intersect the vectors to represent the relationship between users and items.

### 4. How to efficiently find the features to be intersected?

- We can intersect high-importance features based on the feature importance provided by models.
- We can generate intersected features with practical meanings, e.g. dividing price by area can get the price per sqft.
- We can train a decision tree and get inspiration from the structure of the trained tree. Every path from the root node to a leaf node can be seen as a way of intersecting features.

### 5. List some text representation models as well as their advantages and disadvantages.

- Bag of words & TF-IDF(Term Frequency-Inverse Document Frequency)

    $TF(t, d) = \frac{cnt(t)}{len(d)}$, $IDF(t) = log \frac{\text{\# document}}{\text{\# documents with t } + 1}$

  - simple, easy to compute
  - cannot represent terms with more than one words (use N-gram)
  - there are many words with similar meaning (use word stemming, lemmatisation)
  
- Topic Model

    Can be used to discover topics in a set of documents.

- Word Embedding

    Project each word in a document as a low-dimention dense vector. A document can be represented as a $N \times K$ matrix. It can serve as the direct input of a deep learning model, but requires further feature engineering before being fed to a machine learning model.

### 6. How does Word2Vec work? What's the difference between it and LDA?

### 7. What problem will insufficient data bring in the context of image classification? How can we solve it?

Insufficient data may lead to model overfitting. To solve the problem, we can:

1. Simplify the model, add regularization, and dropout.
2. Data augmentation by image rotation, flipping, shifting, etc.
3. Transfer learning. Fine-tune a pre-trained model trained on a small dataset.
