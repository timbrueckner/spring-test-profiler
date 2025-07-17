#!/bin/bash

# Script to update versions after a successful release
# Usage: ./update-versions.sh <releaseVersion> <nextDevVersion>

set -e

if [ $# -ne 2 ]; then
    echo "Usage: $0 <releaseVersion> <nextDevVersion>"
    echo "Example: $0 1.0.0 1.1.0-SNAPSHOT"
    exit 1
fi

RELEASE_VERSION="$1"
NEXT_DEV_VERSION="$2"

echo "🔄 Updating versions..."
echo "Release version: $RELEASE_VERSION"
echo "Next dev version: $NEXT_DEV_VERSION"

# Update README.md with release version
echo "📝 Updating README.md with release version..."
sed -i "" "s/Latest%20Version-[0-9]*\.[0-9]*\.[0-9]*/Latest%20Version-$RELEASE_VERSION/" README.md
sed -i "" "s/<version>[0-9]*\.[0-9]*\.[0-9]*<\/version>/<version>$RELEASE_VERSION<\/version>/" README.md
sed -i "" "s/spring-test-profiler:[0-9]*\.[0-9]*\.[0-9]*/spring-test-profiler:$RELEASE_VERSION/" README.md
echo "✅ Updated README.md with release version $RELEASE_VERSION"

# Set next development version in main pom.xml
echo "📝 Updating main pom.xml to next development version..."
./mvnw --batch-mode versions:set -DnewVersion="$NEXT_DEV_VERSION"
echo "✅ Updated main pom.xml to $NEXT_DEV_VERSION"

# Update demo Maven projects
echo "📝 Updating demo Maven projects..."
find demo -name "pom.xml" -exec sed -i "" "s/<version>[0-9]*\.[0-9]*\.[0-9]*\(-SNAPSHOT\)\{0,1\}<\/version>/<version>$NEXT_DEV_VERSION<\/version>/" {} \;
echo "✅ Updated demo Maven projects to $NEXT_DEV_VERSION"

# Update demo Gradle projects
echo "📝 Updating demo Gradle projects..."
find demo -name "build.gradle" -exec sed -i "" "s/digital.pragmatech.testing:spring-test-profiler:[^']*/digital.pragmatech.testing:spring-test-profiler:$NEXT_DEV_VERSION/" {} \;
echo "✅ Updated demo Gradle projects to $NEXT_DEV_VERSION"

echo "🎉 All version updates completed successfully!"