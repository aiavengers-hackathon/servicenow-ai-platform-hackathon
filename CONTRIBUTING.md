# Contributing Guide - ServiceNow AI Platform

## 🤝 Welcome Contributors!

Thank you for your interest in contributing to the ServiceNow AI Platform. This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our Code of Conduct:

- Be respectful and inclusive
- Welcome different viewpoints and experiences
- Provide constructive feedback
- Accept responsibility and apologize when mistakes are made
- Focus on what is best for the community

## Getting Started

### Prerequisites

Ensure you have:
- Git configured with your name and email
- Python 3.11+
- Node.js 18+
- An Azure OpenAI account (for testing AI features)

### Fork and Clone

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/servicenow-ai-platform.git
cd servicenow-ai-platform-hackathon

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL-REPO/servicenow-ai-platform.git

# 4. Keep your fork updated
git fetch upstream
git rebase upstream/main
```

### Setup Development Environment

```bash
# Run the setup script
bash scripts/setup.sh

# Configure Azure OpenAI credentials
bash scripts/setup-local.sh
```

## Development Workflow

### 1. Create a Feature Branch

```bash
# Create a new branch from main
git checkout upstream/main
git pull upstream main
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/your-bug-name

# Or for documentation
git checkout -b docs/your-doc-name
```

### 2. Make Changes

**Keep commits focused**:
- One logical change per commit
- Smaller commits are easier to review
- Run tests after making changes

### 3. Commit Your Work

See [Commit Guidelines](#commit-guidelines)

### 4. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# Use the template provided
```

## Commit Guidelines

### Format

```
type: subject

body

footer
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `chore`: Build process, dependencies, etc.

### Subject Line

- Use imperative mood: "add" not "added" or "adds"
- Don't capitalize first letter
- No period at the end
- Limit to 50 characters

### Body

- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line

### Footer

Reference issues: `Closes #123`

### Examples

**Good**:
```
feat: add intent detection for change requests

Add machine learning-based intent detection to better identify
change requests. This improves accuracy from 75% to 92%.

Closes #456
```

**Poor**:
```
Update stuff

Fixed some bugs and added features
```

## Pull Request Process

### Before Submitting

1. **Update main**: `git rebase upstream/main`
2. **Run tests**: Ensure all tests pass
3. **Check linting**: Follow code style guidelines
4. **Update documentation**: Add/update docs for your changes
5. **Sign commits** (if required): Use GPG signing

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Breaking change

## Related Issues
Closes #123

## Testing
Describe how you tested:
- [ ] Backend tests pass
- [ ] Frontend tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] Changes tested locally
```

### Review Process

1. **Automatic Checks**: GitHub Actions run tests
2. **Code Review**: Maintainers review code
3. **Feedback**: Address reviewer comments
4. **Approval**: Maintainer approves changes
5. **Merge**: Maintainer merges to main

### During Review

- Respond to feedback promptly
- Push additional commits (don't force-push)
- Ask questions if feedback is unclear
- Be respectful and professional

## Coding Standards

### Python

**Style**: PEP 8

```python
# Good
def calculate_total(items: List[int]) -> int:
    """
    Calculate total of items.
    
    Args:
        items: List of integer values
        
    Returns:
        Sum of all items
    """
    return sum(items)


# Bad
def calc(i):
    return sum(i)
```

**Tools**:
```bash
# Format code
black backend/

# Check style
flake8 backend/

# Type checking
mypy backend/
```

### JavaScript

**Style**: ES6+, follow Airbnb style guide

```javascript
// Good
async function fetchUserData(userId) {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// Bad
function fetchUserData(id) {
  return api.get('/users/' + id).then(res => res.data);
}
```

**Tools**:
```bash
# Format code
npx prettier --write frontend/

# Check style
npx eslint frontend/
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run specific test
pytest tests/test_intents.py::test_detect_incident

# Run with coverage
pytest --cov=app tests/

# Run in watch mode
pytest-watch
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Writing Tests

**Backend**:
```python
# tests/test_intents.py
import pytest
from app.ai.intents import detect_intent


def test_detect_incident():
    """Test incident detection."""
    result = detect_intent("VPN is not working")
    assert result["type"] == "incident"
    assert result["severity"] == "high"


def test_detect_access_request():
    """Test access request detection."""
    result = detect_intent("I need access to BAAMR")
    assert result["type"] == "access_request"
```

**Frontend**:
```javascript
// tests/api.test.js
import { chatWithAI } from '../services/api';

describe('API Service', () => {
  test('chatWithAI sends message correctly', async () => {
    const response = await chatWithAI('Hello');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('response');
  });
});
```

### Coverage Requirements

- Minimum 80% code coverage
- All new features must have tests
- All bug fixes must have regression tests

## Documentation

### README Updates

Update README if you:
- Add new features
- Change setup process
- Add dependencies

### Code Comments

```python
# Good: Explains why, not what
# We use this algorithm because it handles edge cases better
result = optimized_algorithm(data)

# Bad: Obvious from code
# Add one to count
count = count + 1
```

### Docstrings

```python
def detect_intent(text: str) -> Dict[str, Any]:
    """
    Detect user intent from input text.
    
    Uses keyword matching and ML to identify whether the user is
    reporting an incident, requesting access, or asking a general
    question.
    
    Args:
        text: The user input text
        
    Returns:
        Dictionary containing:
            - type: Intent type (incident/access_request/general)
            - confidence: Confidence score 0-1
            - metadata: Additional intent-specific data
            
    Raises:
        ValueError: If text is empty
        
    Examples:
        >>> detect_intent("VPN is down")
        {'type': 'incident', 'severity': 'high'}
    """
```

### Update Documentation

If you add a new feature:

1. Update [DEVELOPMENT.md](./DEVELOPMENT.md)
2. Update [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. Update relevant README sections
4. Add code examples

## Reporting Bugs

### Before Submitting

1. **Search existing issues**: Avoid duplicates
2. **Verify reproducibility**: Can you reproduce consistently?
3. **Check documentation**: Issue might be documented
4. **Try latest version**: Bug might be fixed

### Bug Report Template

```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. Observed result

## Expected Behavior
What should happen

## Environment
- OS: (Windows/Mac/Linux)
- Python version: (if applicable)
- Node version: (if applicable)
- Browser: (if applicable)

## Error Messages
```
Paste full error message here
```

## Additional Context
Screenshots, logs, or other relevant info
```

## Feature Requests

### Before Submitting

1. **Check for duplicates**: Similar feature might exist
2. **Consider fit**: Does it align with project goals?
3. **Think about design**: How would it work?

### Feature Request Template

```markdown
## Description
What should the feature do?

## Use Case
Why do you need this feature?

## Proposed Solution
How should it work?

## Alternative Solutions
Other approaches considered?

## Additional Context
Examples, sketches, or references
```

## Development Tips

### Debugging

```python
# Backend debugging
import pdb; pdb.set_trace()  # Sets breakpoint

# Or use logging
import logging
logging.debug("Debug message: %s", variable)
```

```javascript
// Frontend debugging
console.log('Debug:', data);
debugger;  // Sets breakpoint in DevTools
```

### Performance Testing

```bash
# Backend
pytest --durations=10 tests/

# Frontend  
npm run build -- --analyze
```

### Database Migration

If you modify database models:
```bash
# Document migration steps
# Include in PR description
```

## Recognition

### Contributors

All contributors will be listed in:
- CONTRIBUTORS.md
- GitHub contributors page

### Commit Credit

If co-authoring:
```
git commit --message "feat: message

Co-authored-by: Name <email@example.com>"
```

## Questions or Need Help?

- **Open an issue**: Ask questions in issues
- **Start a discussion**: Use GitHub discussions
- **Email maintainers**: Contact team for sensitive topics

## Resources

- [Python Style Guide (PEP 8)](https://pep8.org/)
- [JavaScript Style Guide](https://airbnb.io/javascript/)
- [Git Documentation](https://git-scm.com/doc)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Summary

Thank you for contributing! Your effort helps improve the ServiceNow AI Platform for everyone.

**Quick Checklist**:
- [ ] Fork and clone repository
- [ ] Create feature branch
- [ ] Make changes with tests
- [ ] Commit with clear messages
- [ ] Push and create PR
- [ ] Respond to review feedback
- [ ] PR merged!

---

**Last Updated**: May 2026  
**Maintainer**: ServiceNow AI Platform Team
