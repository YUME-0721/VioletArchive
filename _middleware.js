export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  
  const country = request.cf?.country || 'XX';
  const region = request.cf?.regionCode || '';
  
  const chinaRegions = ['CN', 'TW', 'HK', 'MO'];
  const isChinaUser = chinaRegions.includes(country);
  
  const chinaDomain = 'blog.2780666.xyz';
  const globalDomain = 'blog.bronica.icu';
  
  const currentHost = url.hostname;
  
  if (isChinaUser && currentHost === globalDomain) {
    const redirectUrl = `https://${chinaDomain}${url.pathname}${url.search}`;
    return Response.redirect(redirectUrl, 302);
  } else if (!isChinaUser && currentHost === chinaDomain) {
    const redirectUrl = `https://${globalDomain}${url.pathname}${url.search}`;
    return Response.redirect(redirectUrl, 302);
  }
  
  return next();
}
