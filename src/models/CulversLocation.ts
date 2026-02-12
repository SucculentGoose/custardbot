import { ICulversLocation } from "../interfaces";

export class CulversLocation {
  private _model: ICulversLocation;
  /**
   * Wraps a raw Culvers location metadata payload.
   */
  constructor(rawCulversLocation: ICulversLocation) {
    this._model = rawCulversLocation;
  }

  /**
   * Returns the dine-in hours metadata JSON string.
   */
  public get dineInHours(): string {
    return this._model.dineInHours;
  }

  /**
   * Returns the drive-thru hours metadata JSON string.
   */
  public get driveThruHours(): string {
    return this._model.driveThruHours;
  }

  /**
   * Returns the curbside hours metadata JSON string.
   */
  public get curbsideHours(): string {
    return this._model.curbsideHours;
  }

  /**
   * Returns late-night drive-thru hours metadata JSON string.
   */
  public get lateNightDriveThruHours(): string {
    return this._model.lateNightDriveThruHours;
  }

  /**
   * Returns the online ordering status code.
   */
  public get onlineOrderStatus(): number {
    return this._model.onlineOrderStatus;
  }

  /**
   * Returns the flavor of the day display name.
   */
  public get flavorOfDayName(): string {
    return this._model.flavorOfDayName;
  }

  /**
   * Returns the flavor of the day description text.
   */
  public get flavorOfTheDayDescription(): string {
    return this._model.flavorOfTheDayDescription;
  }

  /**
   * Returns the image slug for the flavor of the day.
   */
  public get flavorOfDayImageSlug(): string {
    return this._model.flavorOfDaySlug;
  }

  /**
   * Returns the full CDN URL for the flavor of the day image.
   */
  public get flavorOfDayImageUrl(): string {
    return `https://cdn.culvers.com/menu-item-detail/${this.flavorOfDayImageSlug}`;
  }

  /**
   * Returns the restaurant open date string.
   */
  public get openDate(): string {
    return this._model.openDate;
  }

  /**
   * Returns whether the restaurant is temporarily closed.
   */
  public get isTemporarilyClosed(): boolean {
    return this._model.isTemporarilyClosed;
  }

  /**
   * Returns the UTC offset for the location.
   */
  public get utcOffset(): number {
    return this._model.utcOffset;
  }

  /**
   * Returns the street address line.
   */
  public get street(): string {
    return this._model.street;
  }

  /**
   * Returns the state abbreviation.
   */
  public get state(): string {
    return this._model.state;
  }

  /**
   * Returns the city name.
   */
  public get city(): string {
    return this._model.city;
  }

  /**
   * Returns the postal code.
   */
  public get postalCode(): string {
    return this._model.postalCode;
  }

  /**
   * Returns the OLO identifier.
   */
  public get oloId(): string {
    return this._model.oloId;
  }

  /**
   * Returns the Culver's restaurant slug.
   */
  public get slug(): string {
    return this._model.slug;
  }

  /**
   * Builds the restaurant URL for the location slug.
   * @returns A URL string when a slug exists; otherwise undefined.
   */
  public get getRestaurantUrl(): string {
    if (this.slug) {
      return `https://www.culvers.com/restaurants/${this.slug}`;
    }
    return undefined;
  }

  /**
   * Returns the job search URL.
   */
  public get jobsearchurl(): string {
    return this._model.jobsearchurl;
  }

  /**
   * Returns the handoff options JSON string.
   */
  public get handoffOptions(): string {
    return this._model.handoffOptions;
  }

  /**
   * Returns the restaurant key identifier.
   */
  public get restKeyId(): string {
    return this._model.restKeyId;
  }

  /**
   * Returns the restaurant number.
   */
  public get restaurantNumber(): string {
    return this._model.restaurantNumber;
  }
}
