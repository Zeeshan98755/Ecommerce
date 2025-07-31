export class User {
    id!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;
    address!: string;
    city!: string;
    zipCode!: number;
    mobNumber!: string;
    role!: string;
}

export class Product {
    id!: string;
    image!: string;
    menuName!: string;
    categoryName!: string;
    subcategoryName!: string;
    brandId!: string;
    title!: string
    color!: string
    disprice!: number;
    price!: number;
    dispercent!: number;
    details!: string;
}

export class OrderItem {
    id!: string;
    productId!: string;
    image!: string;
    title!: string;
    color!: string;
    quantity!: string;
    price!: number;
    disprice!: number;
    dispercent!: number;
}

export class Order {
    id!: string;
    userId!: string;
    items!: OrderItem[];
    totalAmount!: number;
    address!: {
        address: string;
        city: string;
        zipCode: string;
        mobNumber: string;
    };
    status!: string;
    createdAt!: string;
}