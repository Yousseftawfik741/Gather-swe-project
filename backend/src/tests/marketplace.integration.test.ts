import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app";
import { prisma } from "../config/database";
import { generateAccessToken } from "../utils/token";

describe("Marketplace integration", () => {
  const suffix = crypto.randomUUID();

  const providerEmail = `provider-${suffix}@example.com`;
  const otherProviderEmail = `other-provider-${suffix}@example.com`;
  const adminEmail = `admin-${suffix}@example.com`;

  let providerUserId: string;
  let otherProviderUserId: string;
  let adminUserId: string;

  let providerId: string;
  let otherProviderId: string;
  let venueId: string;
  let imageId: string;

  let providerToken: string;
  let otherProviderToken: string;
  let adminToken: string;

  const venueData = {
    name: "Gather Test Wedding Hall",
    description: "A test venue for marketplace integration",
    type: "WEDDING_HALL",
    address: "123 Test Street",
    city: "Cairo",
    capacity: 300,
    price: 25000,
    currency: "EGP",
  };

  before(async () => {
    process.env.JWT_SECRET = "GatherDevelopmentTestSecret123456789!";

    const providerUser = await prisma.user.create({
      data: {
        firstName: "Test",
        lastName: "Provider",
        email: providerEmail,
        passwordHash: "test-hash",
      },
    });

    const otherProviderUser = await prisma.user.create({
      data: {
        firstName: "Other",
        lastName: "Provider",
        email: otherProviderEmail,
        passwordHash: "test-hash",
        role: "PROVIDER",
      },
    });

    const adminUser = await prisma.user.create({
      data: {
        firstName: "Test",
        lastName: "Admin",
        email: adminEmail,
        passwordHash: "test-hash",
        role: "ADMIN",
      },
    });

    providerUserId = providerUser.id;
    otherProviderUserId = otherProviderUser.id;
    adminUserId = adminUser.id;

    providerToken = generateAccessToken(providerUserId);
    otherProviderToken = generateAccessToken(otherProviderUserId);
    adminToken = generateAccessToken(adminUserId);

    const otherProvider = await prisma.provider.create({
      data: {
        userId: otherProviderUserId,
        businessName: "Other Test Business",
        status: "APPROVED",
      },
    });

    otherProviderId = otherProvider.id;
  });

  after(async () => {
    if (providerId) {
      await prisma.venueImage.deleteMany({
        where: { venue: { providerId } },
      });

      await prisma.venue.deleteMany({
        where: { providerId },
      });

      await prisma.provider.deleteMany({
        where: { id: providerId },
      });
    }

    if (otherProviderId) {
      await prisma.venue.deleteMany({
        where: { providerId: otherProviderId },
      });

      await prisma.provider.deleteMany({
        where: { id: otherProviderId },
      });
    }

    await prisma.user.deleteMany({
      where: {
        id: {
          in: [providerUserId, otherProviderUserId, adminUserId],
        },
      },
    });
  });

  it("creates a provider profile", async () => {
    const response = await request(app)
      .post("/api/providers")
      .set("Cookie", `accessToken=${providerToken}`)
      .send({
        businessName: "Gather Test Business",
        description: "Test provider description",
        phone: "+201000000000",
        address: "Cairo, Egypt",
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.provider.status, "PENDING");

    providerId = response.body.data.provider.id;
  });

  it("rejects duplicate provider profile creation", async () => {
    const response = await request(app)
      .post("/api/providers")
      .set("Cookie", `accessToken=${providerToken}`)
      .send({
        businessName: "Duplicate Business",
      });

    assert.equal(response.status, 409);
  });

  it("rejects provider profile creation without authentication", async () => {
    const response = await request(app).post("/api/providers").send({
      businessName: "Unauthorized Business",
    });

    assert.equal(response.status, 401);
  });

  it("allows the provider to retrieve their profile", async () => {
    const response = await request(app)
      .get("/api/providers/me")
      .set("Cookie", `accessToken=${providerToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.data.provider.id, providerId);
  });

  it("allows the provider to update their profile", async () => {
    const response = await request(app)
      .patch("/api/providers/me")
      .set("Cookie", `accessToken=${providerToken}`)
      .send({
        businessName: "Updated Gather Test Business",
      });

    assert.equal(response.status, 200);
    assert.equal(
      response.body.data.provider.businessName,
      "Updated Gather Test Business",
    );
  });

  it("allows admins to list pending providers", async () => {
    const response = await request(app)
      .get("/api/providers/pending")
      .set("Cookie", `accessToken=${adminToken}`);

    assert.equal(response.status, 200);

    assert.ok(
      response.body.data.providers.some(
        (provider: { id: string }) => provider.id === providerId,
      ),
    );
  });

  it("rejects non-admin users from listing pending providers", async () => {
    const response = await request(app)
      .get("/api/providers/pending")
      .set("Cookie", `accessToken=${providerToken}`);

    assert.equal(response.status, 403);
  });

  it("prevents unapproved providers from creating venues", async () => {
    const response = await request(app)
      .post("/api/venues")
      .set("Cookie", `accessToken=${providerToken}`)
      .send(venueData);

    assert.equal(response.status, 403);
  });

  it("allows an admin to approve a provider", async () => {
    const response = await request(app)
      .patch(`/api/providers/${providerId}/status`)
      .set("Cookie", `accessToken=${adminToken}`)
      .send({ status: "APPROVED" });

    assert.equal(response.status, 200);
    assert.equal(response.body.data.provider.status, "APPROVED");
  });

  it("rejects non-admin provider approval attempts", async () => {
    const response = await request(app)
      .patch(`/api/providers/${otherProviderId}/status`)
      .set("Cookie", `accessToken=${providerToken}`)
      .send({ status: "APPROVED" });

    assert.equal(response.status, 403);
  });

  it("allows approved providers to create venues", async () => {
    const response = await request(app)
      .post("/api/venues")
      .set("Cookie", `accessToken=${providerToken}`)
      .send(venueData);

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.venue.name, venueData.name);

    venueId = response.body.data.venue.id;
  });

  it("rejects invalid venue data", async () => {
    const response = await request(app)
      .post("/api/venues")
      .set("Cookie", `accessToken=${providerToken}`)
      .send({
        name: "A",
        capacity: -5,
        price: -100,
      });

    assert.equal(response.status, 400);
  });

  it("allows the public to retrieve a venue", async () => {
    const response = await request(app).get(`/api/venues/${venueId}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.data.venue.id, venueId);
  });

  it("allows public venue search and filtering", async () => {
    const response = await request(app).get("/api/venues").query({
      city: "Cairo",
      type: "WEDDING_HALL",
      page: 1,
      limit: 10,
    });

    assert.equal(response.status, 200);

    assert.ok(
      response.body.data.venues.some(
        (venue: { id: string }) => venue.id === venueId,
      ),
    );
  });

  it("rejects invalid venue type filters", async () => {
    const response = await request(app)
      .get("/api/venues")
      .query({ type: "INVALID_TYPE" });

    assert.equal(response.status, 400);
  });

  it("allows the owner to update their venue", async () => {
    const response = await request(app)
      .patch(`/api/venues/${venueId}`)
      .set("Cookie", `accessToken=${providerToken}`)
      .send({
        name: "Updated Gather Test Wedding Hall",
      });

    assert.equal(response.status, 200);
    assert.equal(
      response.body.data.venue.name,
      "Updated Gather Test Wedding Hall",
    );
  });

  it("prevents another provider from updating the venue", async () => {
    const response = await request(app)
      .patch(`/api/venues/${venueId}`)
      .set("Cookie", `accessToken=${otherProviderToken}`)
      .send({
        name: "Unauthorized Venue Update",
      });

    assert.equal(response.status, 404);
  });

  it("allows the owner to add venue images", async () => {
    const response = await request(app)
      .post(`/api/venues/${venueId}/images`)
      .set("Cookie", `accessToken=${providerToken}`)
      .send({
        url: "https://example.com/gather-test-venue.jpg",
        altText: "Test wedding hall",
        isPrimary: true,
        sortOrder: 0,
      });

    assert.equal(response.status, 201);

    imageId = response.body.data.image.id;
  });

  it("prevents another provider from deleting venue images", async () => {
    const response = await request(app)
      .delete(`/api/venues/${venueId}/images/${imageId}`)
      .set("Cookie", `accessToken=${otherProviderToken}`);

    assert.equal(response.status, 404);
  });

  it("allows the owner to delete venue images", async () => {
    const response = await request(app)
      .delete(`/api/venues/${venueId}/images/${imageId}`)
      .set("Cookie", `accessToken=${providerToken}`);

    assert.equal(response.status, 200);
  });

  it("allows the owner to deactivate a venue", async () => {
    const response = await request(app)
      .delete(`/api/venues/${venueId}`)
      .set("Cookie", `accessToken=${providerToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.data.venue.isActive, false);
  });

  it("hides deactivated venues from public browsing", async () => {
    const response = await request(app).get(`/api/venues/${venueId}`);

    assert.equal(response.status, 404);
  });

  it("rejects inactive provider accounts", async () => {
    await prisma.user.update({
      where: { id: providerUserId },
      data: { isActive: false },
    });

    const response = await request(app)
      .post("/api/venues")
      .set("Cookie", `accessToken=${providerToken}`)
      .send(venueData);

    assert.equal(response.status, 401);

    await prisma.user.update({
      where: { id: providerUserId },
      data: { isActive: true },
    });
  });
});
