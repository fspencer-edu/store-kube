import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Create S3 bucket
const bucket = new aws.s3.Bucket("my-bucket");

// Ownership controls
const ownershipControls = new aws.s3.BucketOwnershipControls("ownership-controls", {
    bucket: bucket.id,
    rule: {
        objectOwnership: "ObjectWriter",
    },
});

// Public access block
const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("public-access-block", {
    bucket: bucket.id,
    blockPublicAcls: false,
    blockPublicPolicy: false,
    ignorePublicAcls: false,
    restrictPublicBuckets: false,
});

// Website configuration
const website = new aws.s3.BucketWebsiteConfiguration("website", {
    bucket: bucket.id,
    indexDocument: {
        suffix: "index.html",
    },
});

// Upload index.html
const bucketObject = new aws.s3.BucketObject("index.html", {
    bucket: bucket.id,
    source: new pulumi.asset.FileAsset("./index.html"),
    contentType: "text/html",
    acl: "public-read",
}, {
    dependsOn: [publicAccessBlock, ownershipControls, website],
});

// Exports
export const bucketName = bucket.id;
export const bucketUrl = pulumi.interpolate`http://${website.websiteEndpoint}`;