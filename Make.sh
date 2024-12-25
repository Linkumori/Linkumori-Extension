#!/bin/bash




# Copy base files
copy_base_files() {
    local target_dir=$1
    rsync -av --exclude='*.pem' \
              --exclude='.git*' \
              --exclude='.github' \
              --exclude='*.crx' \
              --exclude='*.sh' \
              --exclude='build*' \
              --exclude='_metadata*' \
              --exclude='docs*' \
              . "$target_dir/"
}
BUILD_DIR="build"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"/{webstore,selfhosted}
# Get current version from manifest
VERSION=$(jq -r '.version' manifest.json)
echo "Current extension version: $VERSION"

# Create manifest content for webstore version
create_webstore_manifest() {
cat > "$BUILD_DIR/webstore/manifest.json" << EOL
{
  "manifest_version": 3,
  "name": "Linkumori (URLs Cleaner)",
  "version": "$VERSION",
  "description": "Clean tracking query parameters from URLs",
  
  "icons": {
    "48": "icons/default/icon48.png",
    "96": "icons/default/icon96.png",
    "128": "icons/default/icon128.png"
  },
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  
  "minimum_chrome_version": "121.0",
  
  "action": {
    "default_icon": "icons/default/icon128.png",
    "default_title": "Linkumori",
    "default_popup": "panel/panelMenu.html"
  },
  
  "permissions": [
    "storage",
    "tabs", 
    "declarativeNetRequest",
    "activeTab",
    "scripting",
    "alarms",
    "unlimitedStorage",
    "contextMenus"
  ],
  
  "host_permissions": [
    "http://*/*",
    "https://*/*"
  ],
    "options_ui": {
    "page": "panel/option.html",
    "open_in_tab": true
  },
  
  "declarative_net_request": {
    "rule_resources": [
      {
        "id": "ruleset_1",
        "enabled": true,
        "path": "/rules/rules1.json"
      },
      {
        "id": "ruleset_2",
        "enabled": true,
        "path": "rules/rules2.json"
      },
      {
        "id": "ruleset_3",
        "enabled": true,
        "path": "rules/rules3.json"
      },
      {
        "id": "ruleset_4",
        "enabled": true,
        "path": "rules/rules4.json"
      },
      {
        "id": "ruleset_5",
        "enabled": true,
        "path": "rules/rules5.json"
      },
      {
        "id": "ruleset_6",
        "enabled": true,
        "path": "rules/rules6.json"
      },
      {
        "id": "ruleset_7",
        "enabled": true,
        "path": "rules/rules7.json"
      },
      {
        "id": "ruleset_8",
        "enabled": true,
        "path": "rules/rules8.json"
      }
    ]
  }
}
EOL
}

# Create manifest content for self-hosted version
create_selfhosted_manifest() {
cat > "$BUILD_DIR/selfhosted/manifest.json" << EOL
{
  "manifest_version": 3,
  "name": "Linkumori (URLs Cleaner)",
  "version": "$VERSION",
  "description": "Clean tracking query parameters from URLs",
  "icons": {
    "48": "icons/default/icon48.png",
    "96": "icons/default/icon96.png",
    "128": "icons/default/icon128.png"
  },
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "minimum_chrome_version": "121.0",
  "action": {
    "default_icon": "icons/default/icon128.png",
    "default_title": "Linkumori",
    "default_popup": "panel/panelMenu.html"
  },
  "permissions": [
    "storage",
    "tabs",
    "declarativeNetRequest",
    "activeTab",
    "scripting",
    "alarms",
    "unlimitedStorage",
    "contextMenus"
  ],
  "host_permissions": [
    "http://*/*",
    "https://*/*"
  ],
    "options_ui": {
    "page": "panel/option.html",
    "open_in_tab": true
  },
  "declarative_net_request": {
    "rule_resources": [
      {
        "id": "ruleset_1",
        "enabled": true,
        "path": "/rules/rules1.json"
      },
      {
        "id": "ruleset_2",
        "enabled": true,
        "path": "rules/rules2.json"
      },
      {
        "id": "ruleset_3",
        "enabled": true,
        "path": "rules/rules3.json"
      },
      {
        "id": "ruleset_4",
        "enabled": true,
        "path": "rules/rules4.json"
      },
      {
        "id": "ruleset_5",
        "enabled": true,
        "path": "rules/rules5.json"
      },
      {
        "id": "ruleset_6",
        "enabled": true,
        "path": "rules/rules6.json"
      },
      {
        "id": "ruleset_7",
        "enabled": true,
        "path": "rules/rules7.json"
      },
      {
        "id": "ruleset_8",
        "enabled": true,
        "path": "rules/rules8.json"
      }
    ]
  },
  "update_url": "https://github.com/Linkumori/Linkumori-Extension/releases/latest/download/updates.xml"
}

EOL
}


echo "Creating Chrome Web Store version..."
copy_base_files "$BUILD_DIR/webstore"
create_webstore_manifest

# Pack webstore version

echo "✅ Chrome Web Store version of source code is  created"

echo "
✨ Build completed successfully!
📁 Build outputs in '$BUILD_DIR/webstore'
"
# Create self-hosted version
echo "Creating self-hosted version..."
copy_base_files "$BUILD_DIR/selfhosted"
create_selfhosted_manifest

# Pack self-hosted version

echo "✅ Self-hosted version of source code is created:"

echo "
✨ Build completed successfully!
📁 Build outputs in '$BUILD_DIR/selfhosted'
"
echo "completed all task successfully! 🎉"