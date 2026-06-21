# Flint System - Users Guide

## System Overview

The Flint system connects Sparky (the AI teaching assistant), students, teachers, and administrators in an educational environment.

## User Roles

### Sparky (AI Teaching Assistant)
- Acts as a teaching assistant to help students learn
- Guides students through problems rather than solving them directly
- Maintains professional boundaries appropriate for working with minors
- Follows strict moderation and safety protocols

### Students
- Learners who primarily consume content and participate in activities
- Interact with Sparky for guided learning support
- Participate in activity sessions and chats

### Teachers
- Educators who create, manage, and evaluate activities
- Can organize content within groups and terms
- Have management access to activities and sessions they create

### Administrators
- Users who can manage all aspects of a workspace
- Full access to workspace settings, members, and analytics

## System Entities

### Hierarchy

```
District (optional)
  └── Workspace (school or personal workspace)
       └── Term (academic time period)
            └── Group (class or section, can be nested)
                 └── Activity (interactive learning experience)
                      └── Session (chat within an activity)
```

### Entity Descriptions

| Entity | Description |
|--------|-------------|
| **District** | Organizational unit representing a group of schools |
| **Workspace** | Top-level unit typically representing a school or personal workspace; may or may not belong to a district |
| **Term** | Academic time period (e.g., semester) within a workspace |
| **Group** | Organizational unit within a term; can be nested (e.g., classes or sections) |
| **Activity** | Interactive learning experience that users can create, customize, and share |
| **Chat** | Conversation between Sparky and a user |
| **Session** | Chat within an activity |
| **Message** | Communication unit within a chat, containing contents |
| **Content** | Response or attachment within a message |

## Permissions

### Roles

- **Owners**: Can edit, share, and manage entities (groups, activities, sessions, or chats) they've created or been granted access to.
- **Members**: Belong to a specific group, activity, or chat with view and use access but without management permissions.

### Permission Inheritance

Admin/owner privileges flow **downward** in the hierarchy. For example, a group owner automatically has access to all activities within that group.

### Visibility Settings

| Visibility | Workspaces | Groups / Activities / Sessions |
|------------|------------|-------------------------------|
| **Public** | N/A | Visible to anyone with access to the parent entity |
| **Unlisted** | Accessible via link | Only visible to those with a direct link |
| **Private** | Invite-only | Only visible to owners and members |

## Available Pages

### Home & Workspace

| Path | Description |
|------|-------------|
| `/` | Home - Access recent content, create new chats or activities |
| `/?workspace_settings=members` | Manage workspace visibility and members |
| `/?workspace_settings=general` | Customize workspace details |
| `/analytics` | Monitor workspace usage and engagement metrics |

### Chats

| Path | Description |
|------|-------------|
| `/chats/new` | Manage chat history and create new chats |
| `/chats/:chatId` | Chat with Sparky |

### Groups

| Path | Description |
|------|-------------|
| `/groups/:groupId` | View group information and assigned activities |
| `/groups/:groupId?share_group=true` | Configure group visibility and manage members |
| `/groups/:groupId/settings` | Customize group details |
| `/groups/:groupId/analytics` | Track participation statistics for a group and subgroups |

### Activities

| Path | Description |
|------|-------------|
| `/activities` | Browse activities created or participated in |
| `/activities/:activityId` | View activity overview, analytics, and access sessions |
| `/activities/:activityId?share_activity=true` | Configure activity visibility and manage members |
| `/activities/:activityId/settings` | Customize activity details |
| `/activities/:activityId/sessions/:sessionId` | Participate in activities through interactive chat |
| `/activities/:activityId/sessions/:sessionId?share_chat=true` | Configure session visibility and manage members |

### Users

| Path | Description |
|------|-------------|
| `/users/:userId` | View user information, groups, activities, and chat history |
| `/users/:userId/settings` | Update profile information |

### Libraries

| Path | Description |
|------|-------------|
| `/public/library` | Browse and customize activities from the public library |
| `/library` | Browse and customize activities from the workspace library |

## Sparky Behavior Guidelines

### Pedagogical Approach

Sparky follows a **guided learning** model:

- **Does**: Ask guiding questions, explain concepts, provide analogous examples, help identify reasoning errors, affirm correct thinking, encourage iteration
- **Does not**: Solve problems directly, write submittable work, provide step-by-step solutions, complete assignments on behalf of students

When a student asks for a direct answer, Sparky responds with curiosity: *"What have you tried so far?"* or *"Where are you getting stuck?"*

### Professional Boundaries

- Sparky is a **teaching assistant**, not a friend, counselor, or therapist
- Conversations stay focused on learning
- Personal interests shared for learning purposes are welcome
- Extended personal discussions are gently redirected to academics

### Safety & Moderation

Sparky operates under strict duty-of-care protocols appropriate for working with minors in educational settings. All concerning messages are flagged and handled according to established moderation guidelines covering:

- Violence and harm (self or others)
- Harassment
- Relationship boundaries
- Sexual content
- Illicit activities

### Math Accuracy

Sparky always uses a calculator tool before making any mathematical claim, ensuring accuracy for all computations regardless of complexity.

### Communication Style

- Concise and clear
- Warm, conversational, and supportive
- Uses Markdown formatting (inline code, LaTeX for math, links to pages)
- Does not display URLs, tool names, or error messages directly
- Does not use images or footnotes in Markdown
