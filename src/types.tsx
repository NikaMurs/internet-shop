export type cartItemType = {
    id: number,
    title: string,
    size: string,
    price: number,
    count: number
}

export type bannerProps = {
    children: React.FunctionComponent
}

export type cardProps = {
    id: number,
    category: number,
    title: string,
    price: number,
    images: Array<string>
}

export type categoriesItem = {
    id: number,
    title: string
}

export type fetchGetProps = {
    url: string,
    type: 'topSales' | 'categories' | 'items' | 'moreItems' | 'itemInfo'
}

export type fetchPostProps = {
    url: string,
    type: 'placeOrder',
    body: {
        owner: {
          phone: string,
          address: string
        },
        items: Array<cartItemType>
      }
}



export type StateType = {
    shop: {
        postStatus: number,
        search: string,
        cartCount: number,
        topSales: {
            isLoading: boolean,
            data: Array<cardProps>
        },
        itemInfo: {
            isLoading: boolean,
            data: {
                id: number,
                category: number,
                title: string,
                images: Array<string>,
                sku: string,
                manufacturer: string,
                color: string,
                material: string,
                reason: string,
                season: string,
                heelSize: string,
                price: number,
                oldPrice: number,
                sizes: Array<{
                    size: string,
                    available: boolean
                }>
            }
        }
        categories: {
            isLoading: boolean,
            data: Array<categoriesItem>
        },
        items: {
            isLoading: boolean,
            data: Array<cardProps>
        },
        moreItems: {
            isDataOver: boolean,
            isLoading: boolean,
            data: Array<cardProps>
        }
    }
}