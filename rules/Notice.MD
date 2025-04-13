# Notice of Modification under GNU General Public License v3

## Original Work Reference
The modifications are based on filter rules originally created by AdguardTeam, found at:
- Source: https://github.com/AdguardTeam/AdguardFilters/blob/master/TrackParamFilter/sections/specific.txt
- Format: Text-based filter list (.txt)
- Original Purpose: Tracking parameter filtering rules for Adguard extension (Manifest V2)

## Format Conversion and Modifications
These modifications involve converting the original Adguard extension (Manifest V2) filter list rules into Chrome Declarative Net Request (DNR) rules in JSON format, followed by subsequent modifications.

### First Modification - Initial Format Conversion
- Date: October 16, 2024
- Modified By: Subham Mahesh
- Nature of Changes: 
  1. Converted Adguard extension (Manifest V2) filter rules to Chrome DNR JSON format
  2. Split converted rules across multiple files
- Resulting Files: 
  - rules4.json
  - rules5.json
  - rules6.json
  - rules7.json
- Technical Detail: Each JSON file contains Adguard extension (Manifest V2) filter rules converted to Chrome's Declarative Net Request rule format, preserving the parameter tracking and removal functionality

### Second Modification - Rule Restructuring
- Date: October 22, 2024
- Modified By: Subham Mahesh
- Target File: rules6.json
- Specific Changes:
  1. Converted and replaced Rule ID 128 content using configuration from Rule ID 2 (rules2.json)
  2. Removed Rule ID 129, integrating its parameters into the new Rule ID 128

### Third Modification - Additional Rule Conversion
- Date: December 13, 2024, 5:07 PM IST
- Modified By: Subham Mahesh
- Resulting Files: rules12.json
- Nature of Changes: 
  1. Converted additional Adguard extension (Manifest V2) filter rules to Chrome DNR format
  2. Implemented them in Chrome's DNR JSON structure
- Source: Same as original (TrackParamFilter/sections/specific.txt)

# Fourth Modification - Rule System Restructuring
Modified by Subham Mahesh in December 19, 2024, 10:07 PM IST
## Overview
This modification involved a comprehensive restructuring of our rule system. The previous implementation contained rules from two distinct sources, which have now been consolidated into a more streamlined format.

## Previous Structure
The files contained:
1. Declarative NetRequest static rules converted by Subham Mahesh from AdGuard's MV2 extension filter lists (originally developed by AdGuard Software Ltd.) - rules12.json, rules4-7.json
2. Independent URL parameter cleaning rules developed by Subham Mahesh - rules1-3.json, rules8.json, rules11.json

## New Structure
All previous files have been replaced with a new set of consolidated rule files (rules1.json through rules6.json). These new files contain:
- Declarative NetRequest static rules converted from AdGuard's MV2 filter lists
- Additional Declarative NetRequest static rules independently developed by Subham Mahesh

## File Changes
### Removed Files
- AdGuard-derived conversions: rules12.json, rules4-7.json
- Subham Mahesh's original rules: rules1-3.json, rules8.json, rules11.json

### Added Files
- New consolidated files: rules1.json through rules6.json

## Attribution
- Original tracking parameter filter lists: © AdGuard Software Ltd.
- Independent URL parameter cleaning rules and conversions: © Subham Mahesh 2024

Fifth Modification - Rule System Expansion
Modified by Subham Mahesh in January 9, 2025, 23:54 IST
Overview
This modification expands the rule system by introducing new rule files and reorganizing the existing structure to better separate independently developed rules from converted rules.
Previous Structure
The files contained consolidated rules in rules1.json through rules6.json, which included both:

Declarative NetRequest static rules converted from AdGuard's MV2 filter lists
Independent URL parameter cleaning rules developed by Subham Mahesh

New Structure
The rule system has been expanded and reorganized to provide both mixed-content files and dedicated independent rule files:

Mixed-content files containing:

Declarative NetRequest static rules converted by Subham Mahesh from AdGuard's MV2 extension filter lists (originally developed by AdGuard Software Ltd.)
Independent URL parameter cleaning rules developed by Subham Mahesh


Dedicated files containing only independently developed rules by Subham Mahesh

File Changes
Added Files

Mixed-content files: rules1.json through rules15.json (containing both converted AdGuard rules and independent rules)

Attribution

Original tracking parameter filter lists: © AdGuard Software Ltd.
Independent URL parameter cleaning rules and conversions: © Subham Mahesh 2024

sixth modification on based on 4th modification file 10.08 A.M IST
modification made by subham mahesh 
in rules3.json 
modification only added new parameter

seventh on 8 april 2025 4.56pm ist delhi
modified rules1.json,rules6.json,rules8.json
by subham mahesh under gpl v3 only license

eighth on 9 april 2025 7.35pm ist delhi
modified rules15.json
by subham mahesh under gpl v3 only license
## License Information
This work is licensed under the GNU General Public License version 3 (GPLv3) only



The complete text of the GNU General Public License version 3 can be found at:
https://www.gnu.org/licenses/gpl-3.0.en.html

For questions or access to the converted and modified JSON files, please contact:
Subham Mahesh

---
End of Notice
