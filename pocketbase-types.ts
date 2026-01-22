/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Admins = "admins",
	Analytics = "analytics",
	Banners = "banners",
	Categories = "categories",
	DeliverySettings = "deliverySettings",
	Orders = "orders",
	Products = "products",
	ReviewCount = "review_count",
	Reviews = "reviews",
	ShippingInfo = "shippingInfo",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type IsoAutoDateString = string & { readonly autodate: unique symbol }
export type RecordIdString = string
export type FileNameString = string & { readonly filename: unique symbol }
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated: IsoAutoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated: IsoAutoDateString
}

export type MfasRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	method: string
	recordRef: string
	updated: IsoAutoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated: IsoAutoDateString
}

export type SuperusersRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export type AdminsRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export type AnalyticsRecord<Tcancelled = unknown, Tdelivered = unknown, Tin_transit = unknown, Tpending = unknown, Tprocessing = unknown> = {
	cancelled?: null | Tcancelled
	delivered?: null | Tdelivered
	id: string
	in_transit?: null | Tin_transit
	pending?: null | Tpending
	processing?: null | Tprocessing
	total_orders?: number
}

export type BannersRecord = {
	banner_img?: FileNameString
	created: IsoAutoDateString
	description?: string
	id: string
	product_id?: RecordIdString
	title?: string
	updated: IsoAutoDateString
}

export type CategoriesRecord = {
	created: IsoAutoDateString
	id: string
	name?: string
	updated: IsoAutoDateString
}

export type DeliverySettingsRecord = {
	city?: string
	country?: string
	created: IsoAutoDateString
	id: string
	state?: string
	street?: string
	updated: IsoAutoDateString
	user_id?: RecordIdString
	zip?: string
}

export type OrdersRecord<TproductOptions = unknown> = {
	created: IsoAutoDateString
	deliveryCode: string
	deliveryFee?: number
	deliverySettings?: RecordIdString
	id: string
	price?: number
	productId?: RecordIdString
	productOptions?: null | TproductOptions
	quantity?: number
	refId?: string
	status?: string
	updated: IsoAutoDateString
	userId?: RecordIdString
}

export type ProductsRecord<Toptions = unknown> = {
	category?: RecordIdString
	created: IsoAutoDateString
	description?: string
	discountPrice?: number
	id: string
	images?: FileNameString[]
	name?: string
	options?: null | Toptions
	price?: number
	quantity?: number
	updated: IsoAutoDateString
}

export type ReviewCountRecord<Taverage_rating = unknown> = {
	average_rating?: null | Taverage_rating
	id: string
	product_id?: RecordIdString
	rating_1?: number
	rating_2?: number
	rating_3?: number
	rating_4?: number
	rating_5?: number
	total_reviews?: number
}

export type ReviewsRecord = {
	created: IsoAutoDateString
	id: string
	product_id?: RecordIdString
	rating?: number
	review?: string
	updated: IsoAutoDateString
	user_id?: RecordIdString
}

export type ShippingInfoRecord = {
	Name?: string
	Phone?: number
	ShippingProvider?: string
	created: IsoAutoDateString
	id: string
	orderId?: RecordIdString
	trackingNumber?: number
	updated: IsoAutoDateString
}

export type UsersRecord = {
	avatar?: FileNameString
	created: IsoAutoDateString
	email: string
	emailVisibility: boolean
	fullName?: string
	id: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AdminsResponse<Texpand = unknown> = Required<AdminsRecord> & AuthSystemFields<Texpand>
export type AnalyticsResponse<Tcancelled = unknown, Tdelivered = unknown, Tin_transit = unknown, Tpending = unknown, Tprocessing = unknown, Texpand = unknown> = Required<AnalyticsRecord<Tcancelled, Tdelivered, Tin_transit, Tpending, Tprocessing>> & BaseSystemFields<Texpand>
export type BannersResponse<Texpand = unknown> = Required<BannersRecord> & BaseSystemFields<Texpand>
export type CategoriesResponse<Texpand = unknown> = Required<CategoriesRecord> & BaseSystemFields<Texpand>
export type DeliverySettingsResponse<Texpand = unknown> = Required<DeliverySettingsRecord> & BaseSystemFields<Texpand>
export type OrdersResponse<TproductOptions = unknown, Texpand = unknown> = Required<OrdersRecord<TproductOptions>> & BaseSystemFields<Texpand>
export type ProductsResponse<Toptions = unknown, Texpand = unknown> = Required<ProductsRecord<Toptions>> & BaseSystemFields<Texpand>
export type ReviewCountResponse<Taverage_rating = unknown, Texpand = unknown> = Required<ReviewCountRecord<Taverage_rating>> & BaseSystemFields<Texpand>
export type ReviewsResponse<Texpand = unknown> = Required<ReviewsRecord> & BaseSystemFields<Texpand>
export type ShippingInfoResponse<Texpand = unknown> = Required<ShippingInfoRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	admins: AdminsRecord
	analytics: AnalyticsRecord
	banners: BannersRecord
	categories: CategoriesRecord
	deliverySettings: DeliverySettingsRecord
	orders: OrdersRecord
	products: ProductsRecord
	review_count: ReviewCountRecord
	reviews: ReviewsRecord
	shippingInfo: ShippingInfoRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	admins: AdminsResponse
	analytics: AnalyticsResponse
	banners: BannersResponse
	categories: CategoriesResponse
	deliverySettings: DeliverySettingsResponse
	orders: OrdersResponse
	products: ProductsResponse
	review_count: ReviewCountResponse
	reviews: ReviewsResponse
	shippingInfo: ShippingInfoResponse
	users: UsersResponse
}

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<{
	// Omit AutoDate fields
	[K in keyof T as Extract<T[K], IsoAutoDateString> extends never ? K : never]: 
		// Convert FileNameString to File
		T[K] extends infer U ? 
			U extends (FileNameString | FileNameString[]) ? 
				U extends any[] ? File[] : File 
			: U
		: never
}, 'id'>

// Create type for Auth collections
export type CreateAuth<T> = {
	id?: RecordIdString
	email: string
	emailVisibility?: boolean
	password: string
	passwordConfirm: string
	verified?: boolean
} & ProcessCreateAndUpdateFields<T>

// Create type for Base collections
export type CreateBase<T> = {
	id?: RecordIdString
} & ProcessCreateAndUpdateFields<T>

// Update type for Auth collections
export type UpdateAuth<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
> & {
	email?: string
	emailVisibility?: boolean
	oldPassword?: string
	password?: string
	passwordConfirm?: string
	verified?: boolean
}

// Update type for Base collections
export type UpdateBase<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>
>

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? CreateAuth<CollectionRecords[T]>
		: CreateBase<CollectionRecords[T]>

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? UpdateAuth<CollectionRecords[T]>
		: UpdateBase<CollectionRecords[T]>

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
	collection<T extends keyof CollectionResponses>(
		idOrName: T
	): RecordService<CollectionResponses[T]>
} & PocketBase
