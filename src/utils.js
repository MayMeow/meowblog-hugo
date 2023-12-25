export function sanitizeUrl(url)
{
    if (url.endsWith("/")) {
        return url;
    }

    return url + "/";
}