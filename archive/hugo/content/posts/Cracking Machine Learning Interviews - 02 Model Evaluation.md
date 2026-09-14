---
title: "Cracking Machine Learning Interviews - 02 Model Evaluation"
date: 2022-05-15 21:40:00
tags: ["Interview", "Machine Learning"]
description: "My note of reading 百面机器学习(The Quest for Machine Learning). Daily Update."
---

> The limitation of metrics.

### 1. What's the limitation of accuracy?

When the positive samples and negative samples are imbalanced, accuracy may not correctly reflect the performance of the model.

### 2. How do we balance precision and recall rate?

We can use the Precision-Recall curve, ROC or F1 score to evaluate the performance of a ranking/classification model.

$$F1 = \frac{2\times precision \times recall}{precision + recall}$$

### 3. The RMSE of the model is high but 95% of samples in the test set are predicted with a small error, why is that? How can we solve it?

RMSE will be heavily influenced by outliers in the dataset. We can remove these outliers if they are considered noise. Otherwise, we have to improve our model. We can also use more robust metrics like Mean Absolute Percent Error (MAPE): $\sum_{i=1}^n |\frac{y_i - \hat y_i}{y_i} | \times \frac{100}{n}$.

> ROC curve.

### 4. What is the ROC curve? How do we draw it?

The x-axis of a ROC curve denotes the False Positive Rate $FPR=\frac{FP}{N}$ and the y-axis denotes the True Positive Rate $TPR = \frac{TP}{P}$. 

A ROC curve can be drawn by keeping changing the threshold and getting the FPR-TPR pairs. Or we can first sort the samples by their predicted probabilities in descending order, then starting at (0,0) we iterate through all samples, moving upward if the sample is positive and moving right if it is negative.

### 5. What's the difference between the ROC curve and the P-R curve?

The shape of the ROC curve remains almost the same when the distribution of positive and negative samples changes while the shape of the P-R curve varies in different datasets. Thus the ROC curve is more stable and can be applied in many different fields.
