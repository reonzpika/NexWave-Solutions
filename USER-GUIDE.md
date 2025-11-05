# User Interaction Guide

Welcome to the NexWave Solutions AI Project Management system! This guide helps you work effectively with the AI assistant in this repository.

## Core Concepts

*   **AI-Managed project docs:** The AI uses `PROJECTS_OVERVIEW.md` and per-project `PROJECT_SUMMARY.md` files as the "single source of truth". The root `PROJECTS_OVERVIEW.md` is a dashboard for all projects, and each project folder has its own detailed `PROJECT_SUMMARY.md`.
*   **Dispatcher & Master Rules:** The AI operates on a two-rule system. The **Dispatcher** handles high-level conversation and project routing, while the **Master Rule** executes detailed tasks like file updates and metadata validation.
*   **Templates:** New projects are created using predefined templates from the `/Templates` directory to ensure consistency.

## How to Interact with the AI

You can interact with the AI using natural language. Here are some common commands and prompts:

### Creating a New Project

> "Create a new project for 'AI-driven marketing analytics'."
> "Let's start a new project called 'QuantumLeap' based on the Idea Validation template."

The AI will find a suitable template, create the necessary folder and `PROJECT_SUMMARY.md`, and prompt you for any required metadata.

### Updating an Existing Project

> "In the 'ClinicPro' project, add a new milestone for 'Complete UI Mockups' due next Friday."
> "Update the status of the 'R&D Grant Submission' project to 'Mentor Review Pending'."

The AI will locate the correct project `PROJECT_SUMMARY.md` and apply the changes.

### General Questions

> "What are the active projects right now?"
> "Show me the current status of the 'ClinicPro' project."

## Best Practices

*   **Be Clear:** The more specific your request, the better the AI can assist you.
*   **Confirm Changes:** The AI will always ask for confirmation before making significant file changes. Please review its proposed modifications.
*   **Trust the docs:** Always refer to `PROJECTS_OVERVIEW.md` and project `PROJECT_SUMMARY.md` for the most up-to-date project information.
