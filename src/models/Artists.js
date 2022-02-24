const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const ArtistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is a required field"],
      unique: [true, "An account is already associated with this email"],
    },
    phoneNumber: {
      type: String,
      unique: [true, "An account is already associated with this phone number"],
      sparse: true,
    },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    password: { type: String, default: "" },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    profilePic: {
      type: String,
      default:
        "https://sizzr-defaults.s3.ap-south-1.amazonaws.com/default_profile.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0xIkcwRQIhALuwh2Nen5KOylgYOaEvsw%2FcJhNZpBaDhRRECSjjfCaSAiAgxpag%2BbMKlX0n7BYPGu26KaKof%2FxpYXwFySh9kxPTGirxAgjA%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDA5Mjk2NDg2OTM4MiIMM4SYOj2QRhCsXPGJKsUCe8M9ZnsnwSarsq9eAcVo0BT0LiO4MB5WdD5V%2Bd0ICxp2edL2%2B4x4P6M9otxK0wjRQM%2Fwluel2UpaO71lZdo3st3hEb1mRgIb6TGG2vGtUjiMZnlLFNvcPPzltJvD%2BvB2zAKBXRDLV%2BEkx0nz0XKD6su6k3Mn5Safc1kjlqT5GF%2BAyWleyd2OgtGi4PB6EG1XvSPErFzbAnjqKjX%2BmF8rdWJR01Q2wPVBxOJIc4oe%2Bycf1%2Fo4c4gQLqriwoKgfTHwjmnDcxdm5mUi7Cnf8CoOMolHSWEHtuExx4dszyspuaI4YIz1GYuJQJKBXCe%2FEVPyRpNJqKMmg1iCRM6HHdLLXdF%2B0FGj4eeWzu9DeM4jbzPG%2FUt4%2FsiJog7ByOP7tXqpkaGwM1oYLIqCIK5s143jG5RMOIVRYdQkUe5LKiwQuvbkHRvICDD7xf%2BPBjqzAo779x5wcvW1xgnuhHcb6SEhhfHei2hesE4P5%2BLyjETa%2BCS34YHVtg1p3UWXtI92u6RQw3wJkVIqFaG%2Bw6AGQj7LC7kSLzmmpQBVXl2vF0%2BjN6M1zbuBcPTmAhPYfB9m6wQq5IR%2BVkA%2By0O5v9r4lfzGeu90FcLp%2FndizoQaDZ19lK6iM6mlDa7AuZGV0wQfty%2FJ%2FPdPdnO0t5GJcCZaPNmrsHM6mQVpSbMpdiGQZ7zSabIl1WBphq%2F%2Bwk2KsKgRi%2BblvOJh1ZEQ4nKmMwlod8ZtVpTWbjRqa1K20uHIDnVs%2BF9YQA66tJgxFoUzrKzXtNbEryDabdH7dIa2Vi828e%2B%2BsO8VdTLWOa6ikcKe1aKqX%2BQZf2tyRSzLkcNFJFx5%2BzPKu0PQtJ9YrS090LRXSPbrKGM%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220206T150841Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIARLJJDKUDA5HFYFUD%2F20220206%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=5ba05d30505ead028c6b18543ecc8f4e935d7ec6d9a492146d8ea66a2b12b827",
    },
    socialMedia: {
      insta: { type: String },
      linkedIn: { type: String },
      facebook: { type: String },
    },
    type: { type: String, enum: ["individual", "employee"] },
    experience: { type: Number },
    profession: { type: String },
    storeDetails: {
      id: { type: mongoose.Types.ObjectId },
      verified: { type: Boolean },
    },
    languages: { type: Array },
  },
  { timestamps: true }
);

ArtistSchema.methods.createJWT = function () {
  return jwt.sign({ artistId: this._id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
};

module.exports = mongoose.model("Artist", ArtistSchema);
