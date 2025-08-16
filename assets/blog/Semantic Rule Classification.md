# Building Smarter File Classification: Lessons from Real-World Testing

When building AI-powered classification systems, the devil is truly in the details. What looks elegant on paper often reveals unexpected challenges when tested against real-world data. In this post, I’ll share insights from an experiment where I tested semantic rules–based classification for files and learned the hard way why **summaries outperform full documents** in certain use cases. If you’re considering building a system that organizes or classifies content using embeddings and similarity search, this might save you time (and frustration).

---

## The Initial Setup

The goal was straightforward:  
- Allow users to classify files into projects based on **semantic similarity with rules**.  
- Rules were written in natural language, often detailed and descriptive.  
- Files could be full PDFs, text documents, or extracted text.  

The architecture looked something like this:
- **OpenAI text-embedding-3-small** for embedding rules and file contents.  
- **SQLite with vector storage** for similarity search.  
- A Go-based backend for monitoring files and applying rules.  

The expectation was simple: compare file embeddings with rule embeddings, pick the closest match, and classify accordingly.

---

## The Problem With Full Files

The first round of testing used **entire file contents**. The result?

> **Accuracy was atrocious.**

Why?  
- Full files often contain **noise** (metadata, irrelevant sections, repeated words).  
- Embedding entire documents dilutes the semantic signal of the **true topic**.  
- Rules are detailed and narrow, while full documents are broad and sprawling.  

For example, an **executive summary** about revisions to the Japanese-Language Proficiency Test (JLPT) matched incorrectly with rules about “BM25 scoring” and “testing patterns.” While both touch on testing, the granularity was mismatched.

---

## Summaries to the Rescue

Switching strategies, I compared **summaries** of files to the rules. Accuracy immediately improved.  

Why did this work better?  
- Summaries cut away irrelevant noise and focus on **core meaning**.  
- Rules themselves are written as **condensed descriptions**, so matching summary-to-rule is a like-to-like comparison.  
- Smaller text chunks reduce embedding drift and improve similarity scores.

From initial experiments, a **30% accuracy rate** looked like a reasonable baseline metric. For an early-stage semantic classification system, this was a huge improvement over full-file comparisons.

---

## Applications of This Approach

This insight is relevant for anyone building systems in areas like:  
- **Document management**: Automatically routing reports, research papers, or notes into the right folders.  
- **Knowledge management**: Mapping content into topics or taxonomies in organizations.  
- **Regulatory compliance**: Classifying files against rulebooks or policies.  
- **Education**: Categorizing syllabi, exam papers, or study notes into learning modules.  

If your classification rules are **detailed and domain-specific**, always consider comparing **summaries to rules** instead of whole documents.

---

## Improving Reliability

Even with summaries, 30% accuracy isn’t production-ready. Some improvements to explore:  

1. **Classification Activity Logging**  
   - Track which rule was matched, why, and what similarity score was produced.  
   - This provides transparency and helps users trust the system.  

2. **Explainability for Users**  
   - Show users *why* a file was classified a certain way.  
   - Example: “This file matched with the rule *‘Files talking about testing patterns’* at 82% similarity.”  

3. **Reranking with LLMs**  
   - Add a lightweight **LLM validator** (e.g., GPT5-nano) to re-check top candidate matches.  
   - This can filter out false positives.  

4. **Human-in-the-Loop**  
   - For uncertain cases, flag the classification for human review.  
   - A “needs review” state balances automation with accuracy.  

---

## Key Takeaways

- **Do not embed full files blindly**: noise kills accuracy.  
- **Summaries work better**: they align structurally with detailed rules.  
- **Add logging and transparency**: users need to know why a classification happened.  
- **Consider rerankers or validators**: lightweight LLMs can push accuracy higher.  
- **Accept human review as necessary**: automation doesn’t replace oversight.  

---

## Closing Thoughts

This experiment was a reminder that semantic classification is not just about **good embeddings**—it’s about how you **frame the comparison**. Summaries proved to be the sweet spot for bridging the gap between long, noisy documents and concise, rule-like criteria.  

For builders exploring **document classification, knowledge organization, or AI-driven compliance systems**, I hope this lesson helps you skip a few pitfalls and design smarter pipelines from day one.
