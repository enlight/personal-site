import * as React from 'react';

const DisqusComments: React.SFC<IHexoGlobalVars<IHexoPostVars>> = (props) => {
  const { theme, page, config } = props;
  return (
    <div id="disqus_thread">
      <script dangerouslySetInnerHTML={{__html: `
        var disqus_shortname = '${theme.disqus}';
        var disqus_identifier = '${page.path}';
        var disqus_title = '${page.title}';
        var disqus_url = '${config.url}/${page.path}';
        (function () {
          var dsq = document.createElement('script');
          dsq.type = 'text/javascript';
          dsq.async = true;
          dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })()
      `}}/>
      <script id="dsq-count-scr" src="//#{theme.disqus}.disqus.com/count.js" async/>
    })();
    </div>
  );
};

export default DisqusComments;
