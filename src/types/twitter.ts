export interface Rule {
    value: string;
    tag: string;
}

export interface Place {
    country: string;
    country_code: string;
    full_name: string;
    geo: {
        type: string;
        bbox: number[];
        properties: any
    }
    id: string;
    name: string;
    place_type: string;
}

export interface User {
    created_at: string;
    description: string;
    id: string;
    profile_image_url: string;
    protected: boolean;
    username: string;
    verified: boolean;
}

export interface TweetRaw {
    author_id: string;
    created_at: string;
    id: string;
    lang: string;
    possibly_sensitive: boolean;
    reply_settings: string;
    source: string;
    text: string;
}

export interface MatchingRule {
    id: string;
    tag: string;
}

export interface TweetStream {
    includes: {
        places: Place[], users: User[], tweets: TweetRaw[]
    },
    matching_rules: MatchingRule[]
}

export interface GeoTag {
    id: string;
    name: string;
    place_type: string;
    full_name: string;
    country: string;
    country_code: string;
    coordinates: {
        lat: number,
        long: number;
    }
}

export interface Tweet {
    id: string;
    userId: string;
    userName: string;
    date: string;
    text: string;
    geo: any;
}