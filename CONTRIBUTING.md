# Contribution Guidelines

We welcome contributions to **Linkumori (Clean URLs)**! Please follow these steps to ensure smooth collaboration and GPL v3 compliance.

## How to Contribute

1. **Fork** the repository from the `main` branch.
2. **Clone** your fork locally and create a new branch for your changes.
3. **Make your changes**:
   - Code, documentation, or rule updates are welcome.
   - If you modify any URL filtering rules (`rules/*.json`), you **must also update** the `NOTICE.md` file to reflect those changes, as per GPL v3 obligations.
4. **Commit** your changes with a clear message.
5. **Push** to your fork and submit a **Pull Request** (PR) back to the `main` branch.

## License Notice

All contributions are automatically licensed under the **GNU General Public License v3.0 or later (GPL-3.0+)**. By submitting a pull request, you agree that:

- Your code will be redistributed under GPL v3 or later.
- You have the right to license your contributions under GPL v3.
- Your contributions may be modified and redistributed by others under the same license.

## Rule Modifications

If you update or create any of the following:

- `rules/*.json`
- `rules/redirect/*.json`
- `rules/exception/*.json`

Then you must:

- Add a line in `NOTICE.md` stating the filename modified, your GitHub username, and a brief description of the change.

### Example entry in `NOTICE.md`:
