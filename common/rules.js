/***********************************************************************************************
 * Linkumori (URLs Purifier) Extension - rules.js
 * ------------------------------------------------------------
    * 
   SPDX-License-Identifier: GPL-3.0-or-later

Copyright (C) 2024 Subham Mahesh

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>..


* ***********************************************************************************************/
export const parameterRules = [
    {
        // Generic parameters
        removeParams: [
            "Echobox", "__hsfp", "__hssc", "__hstc",
            "__s", "__twitter_impression", "_ga", "_gl",
            "_hsenc", "_openstat", "action_object_map", "action_type_map",
            "ceneo_spo", "cmpid", "dclid", "fb_action_ids",
            "fb_action_types", "fb_ref", "fb_source", "fbclid",
            "ga_campaign", "ga_content", "ga_medium", "ga_source",
            "ga_term", "gclid", "gs_l", "hmb_campaign",
            "hmb_medium", "hmb_source", "hsCtaTracking", "itm_campaign",
            "itm_medium", "itm_source", "mc_", "mc_cid",
            "mc_eid", "mc_tc", "mkt_tok", "ml_subscriber",
            "ml_subscriber_hash", "msclkid", "mtm_campaign", "mtm_cid",
            "mtm_content", "mtm_group", "mtm_keyword", "mtm_medium",
            "mtm_placement", "mtm_source", "oly_anon_id", "oly_enc_id",
            "os_ehash", "otm_campaign", "otm_content", "otm_medium",
            "otm_source", "otm_term", "rb_clickid", "s_cid",
            "spm", "tracking_source", "twclid", "utm_campaign",
            "utm_content", "utm_id", "utm_medium", "utm_name",
            "utm_referrer", "utm_source", "utm_term", "vero_conv",
            "vero_id", "vn_", "wickedid", "wt_mc",
            "wtrid", "yclid"
        ]
    },
    {
        domain: "1password.university",
        removeParams: [
            "utm_ref"
        ]
    },
    {
        domain: "3movs.com",
        removeParams: [
            "site_id"
        ]
    },
    {
        domain: "7net.omni7.jp",
        removeParams: [
            "intpr", "intpr2"
        ]
    },
    {
        domain: "9gag.com",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "abcnyheter.no",
        removeParams: [
            "nr"
        ]
    },
    {
        domain: "academic.oup",
        removeParams: [
            "redirectedFrom"
        ]
    },
    {
        domain: "account.microsoft.com",
        removeParams: [
            "refd"
        ]
    },
    {
        domain: "ad.admitad.com",
        removeParams: [
            "/^subid/"
        ]
    },
    {
        domain: "ad.doubleclick.net",
        removeParams: [
            "/^dc_trk_/"
        ]
    },
    {
        domain: "adguard.com",
        removeParams: [
            "clid"
        ]
    },
    {
        domain: "adj.st",
        removeParams: [
            "CollectionId", "adj_adgroup", "adj_adnomia_click_id", "adj_campaign",
            "adj_creative", "adj_deeplink", "adj_event_callback_dn2j7g_5mdnim", "adj_install_callback",
            "adjust_deeplink", "pd", "pfx", "pt"
        ]
    },
    {
        domain: "adjust.com",
        removeParams: [
            "adgroup"
        ]
    },
    {
        domain: "adobe.com",
        removeParams: [
            "mv2", "ref"
        ]
    },
    {
        domain: "adorama.com",
        removeParams: [
            "bc_pid", "obem", "sterm"
        ]
    },
    {
        domain: "ads.tiktok.com",
        removeParams: [
            "_source_", "cacheSDK", "region"
        ]
    },
    {
        domain: "adshares.net",
        removeParams: [
            "cid"
        ]
    },
    {
        domain: "adweek.com",
        removeParams: [
            "traffic_source"
        ]
    },
    {
        domain: "affiliate.insider.com",
        removeParams: [
            "amazonTrackingID", "h", "platform", "postID",
            "postSlug"
        ]
    },
    {
        domain: "agata88.com",
        removeParams: [
            "source"
        ]
    },
    {
        domain: "agoda.com",
        removeParams: [
            "tag"
        ]
    },
    {
        domain: "airbnb.com",
        removeParams: [
            "federated_search_id", "search_type", "source", "source_impression_id"
        ]
    },
    {
        domain: "aktualne.cz",
        removeParams: [
            "dop_ab_variant", "dop_id", "dop_req_id", "dop_source_zone_name"
        ]
    },
    {
        domain: "alibaba.com",
        removeParams: [
            "categoryIds"
        ]
    },
    {
        domain: "aliexpress.com",
        removeParams: [
            "__tppBottom", "_t", "af", "aff_fcid",
            "aff_fsk", "aff_platform", "aff_request_id", "aff_short_key",
            "aff_trace_key", "algo_expid", "algo_pvid", "btsid",
            "curPageLogUid", "cv", "dp", "gatewayAdapt",
            "gps-id", "initiative_id", "mall_affr", "pdp_ext_f",
            "pdp_npi", "pdp_pi", "pvid", "scm",
            "scm-url", "scm[_a-z-]*", "scm_id", "sk",
            "spm", "terminal_id", "tt", "utparam",
            "ws_ab_test"
        ]
    },
    {
        domain: "aliyun.com",
        removeParams: [
            "scm"
        ]
    },
    {
        domain: "allabout.co.jp",
        removeParams: [
            "FM"
        ]
    },
    {
        domain: "allbeauty.com",
        removeParams: [
            "abref"
        ]
    },
    {
        domain: "allegro.pl",
        removeParams: [
            "reco_id", "sid"
        ]
    },
    {
        domain: "allrecipes.com",
        removeParams: [
            "clickId", "internalSource", "referringContentType", "referringId"
        ]
    },
    {
        domain: "alternate.de",
        removeParams: [
            "campaign", "idealoid", "partner"
        ]
    },
    {
        domain: "alza.de",
        removeParams: [
            "kampan"
        ]
    },
    {
        domain: "am730.com.hk",
        removeParams: [
            "ncid"
        ]
    },
    {
        domain: "ambcrypto.com",
        removeParams: [
            "wp_source"
        ]
    },
    {
        domain: "amc.com",
        removeParams: [
            "bclid", "bcpid", "bctid"
        ]
    },
    {
        domain: "ameblo.jp",
        removeParams: [
            "adxarea", "frm_id"
        ]
    },
    {
        domain: "analytics.bluekai.com",
        removeParams: [
            "phint"
        ]
    },
    {
        domain: "announcements.bybit.com",
        removeParams: [
            "pid", "sa_utm_channel", "sa_utm_ci", "sa_utm_tcn"
        ]
    },
    {
        domain: "apnews.com",
        removeParams: [
            "user_email"
        ]
    },
    {
        domain: "app.5-delivery.ru",
        removeParams: [
            "c", "pid"
        ]
    },
    {
        domain: "app.adjust.com",
        removeParams: [
            "campaign", "creative", "install_callback", "ip_address",
            "nend_click_id", "user_agent"
        ]
    },
    {
        domain: "app.mi.com",
        removeParams: [
            "appClientId", "appSignature", "nonce", "ref"
        ]
    },
    {
        domain: "app.slack.com",
        removeParams: [
            "entry_point"
        ]
    },
    {
        domain: "app.snyk.io",
        removeParams: [
            "pagedoc"
        ]
    },
    {
        domain: "apple.com",
        removeParams: [
            "/ign-.*", "afid", "app", "cid",
            "ct", "fnode", "ign-itsc[a-z]+", "mttn3pid",
            "mttnagencyid", "mttncc", "mttnpid", "mttnsiteid",
            "mttnsubad", "mttnsubkw", "mttnsubplmnt", "pt"
        ]
    },
    {
        domain: "applesfera.com",
        removeParams: [
            "NID"
        ]
    },
    {
        domain: "approach.yahoo.co.jp",
        removeParams: [
            "code"
        ]
    },
    {
        domain: "arcelik.com.tr",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "archive.org",
        removeParams: [
            "iax"
        ]
    },
    {
        domain: "argos.co.uk",
        removeParams: [
            "clickOrigin", "istBid", "istCompanyId", "istFeedId",
            "istItemId"
        ]
    },
    {
        domain: "arms-retcode.aliyuncs",
        removeParams: [
            "_v", "api", "begin", "behavior",
            "c2", "c3", "code", "ct",
            "dl", "enableLinkTrace", "enableSPA", "environment",
            "flag", "msg", "page", "pid",
            "post_res", "pv_id", "release", "sample",
            "sampling", "sr", "success", "tag",
            "traceId", "uid", "vp"
        ]
    },
    {
        domain: "artstation.com",
        removeParams: [
            "/\d.*"
        ]
    },
    {
        domain: "as.com",
        removeParams: [
            "id_externo_noti", "m1", "m2", "m3",
            "m4", "m5", "omnil", "ssmdoc"
        ]
    },
    {
        domain: "asahi.com",
        removeParams: [
            "cid", "iref", "ref"
        ]
    },
    {
        domain: "asos.com",
        removeParams: [
            "ctaref"
        ]
    },
    {
        domain: "atlassian.net",
        removeParams: [
            "atlOrigin"
        ]
    },
    {
        domain: "audible.com",
        removeParams: [
            "/ref/", "creativeId", "ipRedirectFrom", "ipRedirectOriginalURL",
            "pageLoadId", "ref", "source_code"
        ]
    },
    {
        domain: "aufast.co",
        removeParams: [
            "/^utm_/", "clickid"
        ]
    },
    {
        domain: "autoplus.fr",
        removeParams: [
            "dr_tracker", "hash", "idprob", "sending_id",
            "site_id"
        ]
    },
    {
        domain: "avast.com",
        removeParams: [
            "__cf_chl_rt_tk"
        ]
    },
    {
        domain: "avira.com",
        removeParams: [
            "track"
        ]
    },
    {
        domain: "awaliwa.com",
        removeParams: [
            "acr", "bd_vid", "c", "lg",
            "old", "s", "z"
        ]
    },
    {
        domain: "awin1.com",
        removeParams: [
            "awinaffid", "clickref", "linkid"
        ]
    },
    {
        domain: "azby.fmworld.net",
        removeParams: [
            "mc_pc"
        ]
    },
    {
        domain: "b23.tv",
        removeParams: [
            "/share_.*", "bbid", "ts"
        ]
    },
    {
        domain: "babbel.com",
        removeParams: [
            "bsc", "btp"
        ]
    },
    {
        domain: "babybunting.com.au",
        removeParams: [
            "cq_cmp", "cq_con", "cq_med", "cq_net",
            "cq_plac", "cq_plt", "cq_pos", "cq_src",
            "cq_term"
        ]
    },
    {
        domain: "backcountry.com",
        removeParams: [
            "CMP_ID", "CMP_SKU", "INT_ID", "MER",
            "fl", "iv_", "k_clickid", "mr:adType",
            "mr:device", "mr:trackingCode", "rmatt", "ti"
        ]
    },
    {
        domain: "bahn.de",
        removeParams: [
            "dbkanal_[0-9]{3}"
        ]
    },
    {
        domain: "baidu.com",
        removeParams: [
            "/from.*", "/rsv.*", "/rsv_.*", "asctag",
            "bsst", "category", "cf", "cl",
            "ct", "dyTabStr", "eqid", "euri",
            "f", "fenlei", "fid", "for",
            "frs", "gsid", "hisfilter", "hl_tag",
            "idctag", "iid", "inputT", "issp",
            "ivk_sa", "jid", "lattr", "lm",
            "logid", "miniId", "n_type", "nc",
            "od", "oq", "p_from", "p_tk",
            "pageFrom", "params_ssrt", "pi", "platform",
            "prefixsug", "prod_type", "ps", "query",
            "rn", "rq", "rqid", "rs_src",
            "rsf", "rsp", "rsv_pq", "rsv_t",
            "sa", "sfrom", "sids", "sourceFrom",
            "srcp", "t_kt", "tn", "tpl_from",
            "usm", "vit", "vslid", "wd",
            "xzhid"
        ]
    },
    {
        domain: "baike.baidu.com",
        removeParams: [
            "fromLemmaModule", "fromModule", "lemmaFrom", "lemmaId",
            "lemmaTitle"
        ]
    },
    {
        domain: "baike.com",
        removeParams: [
            "prd", "search_id", "view_id"
        ]
    },
    {
        domain: "baike.sogou.com",
        removeParams: [
            "ch"
        ]
    },
    {
        domain: "bandcamp.com",
        removeParams: [
            "from", "search_item_id", "search_item_type", "search_match_part",
            "search_page_no", "search_rank"
        ]
    },
    {
        domain: "banggood.com",
        removeParams: [
            "custlinkid", "utmid"
        ]
    },
    {
        domain: "basketballking.jp",
        removeParams: [
            "cx_art"
        ]
    },
    {
        domain: "bbc.com",
        removeParams: [
            "at_[a-z_]+", "at_bbc_team", "at_campaign", "at_campaign_type",
            "at_creation", "at_custom1", "at_custom2", "at_custom3",
            "at_custom4", "at_format", "at_identifier", "at_link_id",
            "at_link_origin", "at_link_type", "at_ptr_name", "at_type",
            "at_variant", "facebook_page", "pinned_post_asset_id", "pinned_post_locator",
            "pinned_post_type", "src_origin", "xtor"
        ]
    },
    {
        domain: "beacon-recommend.tower.jp",
        removeParams: [
            "tracking_id"
        ]
    },
    {
        domain: "bedbathandbeyond.com",
        removeParams: [
            "lyceumGuid", "osp", "refccid", "searchidx"
        ]
    },
    {
        domain: "belk.com",
        removeParams: [
            "start"
        ]
    },
    {
        domain: "belta.co.jp",
        removeParams: [
            "cid"
        ]
    },
    {
        domain: "bestbuy.com",
        removeParams: [
            "acampID", "intl", "irclickid", "irgwc",
            "loc", "mpid"
        ]
    },
    {
        domain: "bet.com",
        removeParams: [
            "xrs"
        ]
    },
    {
        domain: "bigfishgames.com",
        removeParams: [
            "npc", "npi", "npv[0-9]+", "pc"
        ]
    },
    {
        domain: "bild.de",
        removeParams: [
            "t_ref"
        ]
    },
    {
        domain: "bilibili.com",
        removeParams: [
            "-Arouter", "/current.*", "/from.*", "/network.*",
            "/playurl.*", "/share_.*", "accept_quality", "bbid",
            "broadcast_type", "bsource", "buvid", "callback",
            "from", "from_source", "from_spm_id", "hotRank",
            "is_story_h5", "mid", "msource", "p2p_type",
            "plat_id", "platform_network_status", "quality_description", "refer_from",
            "referfrom", "seid", "share_from", "share_medium",
            "share_plat", "share_session_id", "share_source", "share_tag",
            "spm_id_from", "spmid", "tdsourcetag", "theme",
            "timestamp", "ts", "type", "unique_k",
            "up_id", "vd_source"
        ]
    },
    {
        domain: "billiger.de",
        removeParams: [
            "log", "p"
        ]
    },
    {
        domain: "bindright.com",
        removeParams: [
            "camp_id"
        ]
    },
    {
        domain: "bing.com",
        removeParams: [
            "/sh[b-np-z0-9]/", "CREA", "FPIG", "PC",
            "PTAG", "PUBL", "adppc", "aqs",
            "cc", "crslsl", "cvid", "ecount",
            "efirst", "form", "go", "gs_lcrp",
            "mkt", "nclid", "pc", "pglt",
            "pq", "qp", "qpvt", "qs",
            "redig", "refig", "rnoreward", "rqpiodemo",
            "sc", "sk", "skipopalnative", "sp",
            "toWww", "ts", "wlexpsignin", "wsso"
        ]
    },
    {
        domain: "bizhint.jp",
        removeParams: [
            "trcd"
        ]
    },
    {
        domain: "bk8win8.com",
        removeParams: [
            "aftcamp"
        ]
    },
    {
        domain: "bleepingcomputer.com",
        removeParams: [
            "cx"
        ]
    },
    {
        domain: "bloculus.com",
        removeParams: [
            "tl_[a-z_]+"
        ]
    },
    {
        domain: "blog.twitch.tv",
        removeParams: [
            "web_only"
        ]
    },
    {
        domain: "blogger.com",
        removeParams: [
            "bpli"
        ]
    },
    {
        domain: "bloglovin.com",
        removeParams: [
            "widget-ref"
        ]
    },
    {
        domain: "blogmura.com",
        removeParams: [
            "p_cid"
        ]
    },
    {
        domain: "blogtrottr.com",
        removeParams: [
            "lctg"
        ]
    },
    {
        domain: "bloomberg.com",
        removeParams: [
            "fromMostRead", "in_source", "leadSource", "re_source",
            "sref", "srnd"
        ]
    },
    {
        domain: "bloomingdales.com",
        removeParams: [
            "ranLinkID", "ranLinkTypeID", "ranPublisherID", "ransiteID"
        ]
    },
    {
        domain: "blue-tomato.com",
        removeParams: [
            "varid",
            "zanox"
        ]
    },
    {
        domain: "boards.greenhouse.io",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "boncharge.com",
        removeParams: [
            "shpxid"
        ]
    },
    {
        domain: "bookdepository.com",
        removeParams: [
            "qid", "sr"
        ]
    },
    {
        domain: "booking.com",
        removeParams: [
            "aid", "redirected", "sid", "srpvid"
        ]
    },
    {
        domain: "boomstore.de",
        removeParams: [
            "campaign"
        ]
    },
    {
        domain: "booster.osnova.io",
        removeParams: [
            "boosterUid", "place"
        ]
    },
    {
        domain: "boredpanda.com",
        removeParams: [
            "cexp_id", "cexp_var", "h"
        ]
    },
    {
        domain: "boulanger.com",
        removeParams: [
            "lgw_code", "xtor"
        ]
    },
    {
        domain: "bp.blogspot.com",
        removeParams: [
            "time"
        ]
    },
    {
        domain: "brazzers.com",
        removeParams: [
            "ats"
        ]
    },
    {
        domain: "bstn.com",
        removeParams: [
            "indexName", "objectID", "queryID"
        ]
    },
    {
        domain: "bugs.co.kr",
        removeParams: [
            "wl_ref"
        ]
    },
    {
        domain: "bunte.de",
        removeParams: [
            "umt_source"
        ]
    },
    {
        domain: "buschgardens.com",
        removeParams: [
            "AFS"
        ]
    },
    {
        domain: "businessinsider.com",
        removeParams: [
            "amp", "inline-endstory-related-recommendations", "opdoc", "r"
        ]
    },
    {
        domain: "but.fr",
        removeParams: [
            "SRC"
        ]
    },
    {
        domain: "buzzfeednews.com",
        removeParams: [
            "bfsource", "ref"
        ]
    },
    {
        domain: "bybit.com",
        removeParams: [
            "/sa_utm_.*"
        ]
    },
    {
        domain: "cafepedagogique.net",
        removeParams: [
            "actCampaignType", "actId", "actSource"
        ]
    },
    {
        domain: "cam4.com",
        removeParams: [
            "act", "showSignupPopup", "suid"
        ]
    },
    {
        domain: "camcam.cc",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "campaigns-serving.cognativex.com",
        removeParams: [
            "device_code", "exc_ads", "history_adids", "history_postids"
        ]
    },
    {
        domain: "cancanlah.com",
        removeParams: [
            "click_id"
        ]
    },
    {
        domain: "cardif.fr",
        removeParams: [
            "at_custom_var10", "at_custom_var9"
        ]
    },
    {
        domain: "carousell.com",
        removeParams: [
            "t-id", "t-referrer_browse_type", "t-referrer_category_id", "t-referrer_page_type",
            "t-referrer_request_id", "t-referrer_search_query", "t-referrer_search_query_source", "t-referrer_sort_by",
            "t-referrer_source", "t-source", "t-tap_index"
        ]
    },
    {
        domain: "carousell.sg",
        removeParams: [
            "t-id", "t-referrer_browse_type", "t-referrer_category_id", "t-referrer_page_type",
            "t-referrer_request_id", "t-referrer_search_query", "t-referrer_search_query_source", "t-referrer_sort_by",
            "t-referrer_source", "t-source", "t-tap_index"
        ]
    },
    {
        domain: "carseven.co.jp",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "cartoonbrew.com",
        removeParams: [
            "cbtr"
        ]
    },
    {
        domain: "casper.com",
        removeParams: [
            "gwlurl"
        ]
    },
    {
        domain: "cbs42.com",
        removeParams: [
            "ipid"
        ]
    },
    {
        domain: "cc.loginfra.com",
        removeParams: [
            "a", "bw", "nsc", "px",
            "py", "sx", "sy"
        ]
    },
    {
        domain: "cc.naver.com",
        removeParams: [
            "bw", "px", "py", "sx",
            "sy"
        ]
    },
    {
        domain: "cdc.gov",
        removeParams: [
            "ACSTrackingID", "ACSTrackingLabel", "deliveryName"
        ]
    },
    {
        domain: "cdninstagram.com",
        removeParams: [
            "_nc_sid", "ccb", "efg"
        ]
    },
    {
        domain: "cdon.com",
        removeParams: [
            "g"
        ]
    },
    {
        domain: "cell.com",
        removeParams: [
            "_returnURL"
        ]
    },
    {
        domain: "cellularcountry.com",
        removeParams: [
            "zenid"
        ]
    },
    {
        domain: "ceneo.com",
        removeParams: [
            "tag"
        ]
    },
    {
        domain: "change.com",
        removeParams: [
            "psf_variant", "share_intent", "source_location"
        ]
    },
    {
        domain: "chase.com",
        removeParams: [
            "jp_cmp"
        ]
    },
    {
        domain: "chemistwarehouse.com.au",
        removeParams: [
            "ranEAID", "ranMID", "ranSiteID"
        ]
    },
    {
        domain: "chinadaily.com.cn",
        removeParams: [
            "cvid"
        ]
    },
    {
        domain: "chitai-gorod.ru",
        removeParams: [
            "partnerId"
        ]
    },
    {
        domain: "cht.com.tw",
        removeParams: [
            "Identifier", "Source"
        ]
    },
    {
        domain: "chunichi.co.jp",
        removeParams: [
            "rct", "ref"
        ]
    },
    {
        domain: "cimri.com",
        removeParams: [
            "commentCount", "hasFavorite", "offerCount", "offerFiltered",
            "offerSponsored", "photoCount", "platformName"
        ]
    },
    {
        domain: "cinematoday.jp",
        removeParams: [
            "g_clk"
        ]
    },
    {
        domain: "citi.com",
        removeParams: [
            "BT_TX", "BT_VanityDomain", "Promo_ID", "ProspectID",
            "aoOfferParams", "intc", "selectedCCIndex", "src"
        ]
    },
    {
        domain: "click.linksynergy.com",
        removeParams: [
            "u1", "u2"
        ]
    },
    {
        domain: "click.speee-ad.jp",
        removeParams: [
            "os", "ref", "sess_id", "slot_index",
            "v"
        ]
    },
    {
        domain: "clickfunnels.com",
        removeParams: [
            "aff_sub"
        ]
    },
    {
        domain: "clicklogger.rm.uol.com.br",
        removeParams: [
            "grp", "msr", "oper"
        ]
    },
    {
        domain: "clickserve.dartsearch.net",
        removeParams: [
            "ds_s_kwgid", "lid"
        ]
    },
    {
        domain: "clips.twitch.tv",
        removeParams: [
            "tt_content", "tt_medium"
        ]
    },
    {
        domain: "cloud.baidu.com",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "cmp.inmobi.com",
        removeParams: [
            "referer"
        ]
    },
    {
        domain: "cmswire.com",
        removeParams: [
            "is_rec", "source", "topic_id"
        ]
    },
    {
        domain: "cnbc.com",
        removeParams: [
            "__source", "par"
        ]
    },
    {
        domain: "cnet.com",
        removeParams: [
            "ftag"
        ]
    },
    {
        domain: "cnn.co.jp",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "coconala.com",
        removeParams: [
            "ref", "ref_kind", "ref_no"
        ]
    },
    {
        domain: "cod.bitrec.com",
        removeParams: [
            "externalVisitorId", "r", "visitorId"
        ]
    },
    {
        domain: "columbiasportswear.com",
        removeParams: [
            "oid"
        ]
    },
    {
        domain: "column.sp.baseball.findfriends.jp",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "community.spiceworks.com",
        removeParams: [
            "carPos"
        ]
    },
    {
        domain: "comodo.com",
        removeParams: [
            "af", "key5sk1", "track"
        ]
    },
    {
        domain: "controld.com",
        removeParams: [
            "cid"
        ]
    },
    {
        domain: "coolapk.com",
        removeParams: [
            "shareFrom", "shareUid"
        ]
    },
    {
        domain: "coolblue.nl",
        removeParams: [
            "PHGref", "clickref", "cmt", "ref"
        ]
    },
    {
        domain: "cosse.de",
        removeParams: [
            "referer", "sPartner"
        ]
    },
    {
        domain: "coupang.com",
        removeParams: [
            "q", "searchId", "traceid", "wPcid",
            "wRef", "wTime"
        ]
    },
    {
        domain: "coursera.org",
        removeParams: [
            "siteID"
        ]
    },
    {
        domain: "creativecloud.adobe.com",
        removeParams: [
            "trackingid"
        ]
    },
    {
        domain: "crunchyroll.com",
        removeParams: [
            "referrer", "return_url", "srsltid"
        ]
    },
    {
        domain: "cyber-ad01.cc",
        removeParams: [
            "ip"
        ]
    },
    {
        domain: "cyber.sports.ru",
        removeParams: [
            "p_a", "p_c", "p_n"
        ]
    },
    {
        domain: "cyberghostvpn.com",
        removeParams: [
            "brand", "media_source"
        ]
    },
    {
        domain: "cyberlink.com",
        removeParams: [
            "affid"
        ]
    },
    {
        domain: "d-markets.net",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "d.odsyms15.com",
        removeParams: [
            "article_id", "ext.referrer", "uid.p"
        ]
    },
    {
        domain: "dailycodingproblem.com",
        removeParams: [
            "email"
        ]
    },
    {
        domain: "dailymail.co.uk",
        removeParams: [
            "ico", "ito"
        ]
    },
    {
        domain: "dailymotion.com",
        removeParams: [
            "ads_params", "origin"
        ]
    },
    {
        domain: "daohang.qq.com",
        removeParams: [
            "fr"
        ]
    },
    {
        domain: "darkfans.com",
        removeParams: [
            "af", "ref"
        ]
    },
    {
        domain: "darty.com",
        removeParams: [
            "dartycid"
        ]
    },
    {
        domain: "dashboard.wedare.pl",
        removeParams: [
            "smc1", "smc2"
        ]
    },
    {
        domain: "datareportal.com",
        removeParams: [
            "rq"
        ]
    },
    {
        domain: "deepdiscount.com",
        removeParams: [
            "bid"
        ]
    },
    {
        domain: "deepl.com",
        removeParams: [
            "cta", "pdf"
        ]
    },
    {
        domain: "deeplearning.com",
        removeParams: [
            "_hsenc", "_hsmi", "ecid"
        ]
    },
    {
        domain: "deezer.com",
        removeParams: [
            "deferredFl", "origin"
        ]
    },
    {
        domain: "defenseone.com",
        removeParams: [
            "oref"
        ]
    },
    {
        domain: "dell.com",
        removeParams: [
            "VEN1", "dgc", "gacd", "nclid"
        ]
    },
    {
        domain: "dengekionline.com",
        removeParams: [
            "osusume_banner"
        ]
    },
    {
        domain: "despegar.com",
        removeParams: [
            "/clt_.*", "mktdata"
        ]
    },
    {
        domain: "dhgate.com",
        removeParams: [
            "f"
        ]
    },
    {
        domain: "dhits.docomo.ne.jp",
        removeParams: [
            "affiliate"
        ]
    },
    {
        domain: "diepresse.com",
        removeParams: [
            "from", "xt_at", "xtor"
        ]
    },
    {
        domain: "dietpartner.jp",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "digikey.com",
        removeParams: [
            "/^utm_cid/"
        ]
    },
    {
        domain: "digitalimpuls.no",
        removeParams: [
            "WebSiteMapNodeID"
        ]
    },
    {
        domain: "discoveryplus.com",
        removeParams: [
            "_referrer", "idp", "responseCode"
        ]
    },
    {
        domain: "disneyplus.com",
        removeParams: [
            "distributionPartner"
        ]
    },
    {
        domain: "disq.us",
        removeParams: [
            "cuid"
        ]
    },
    {
        domain: "dl-protect.com",
        removeParams: [
            "fn", "rl"
        ]
    },
    {
        domain: "dmkt-sp.jp",
        removeParams: [
            "impressionId"
        ]
    },
    {
        domain: "dmm.co.jp",
        removeParams: [
            "dmmref", "i3_ord", "i3_ref"
        ]
    },
    {
        domain: "docs.kernel.org",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "docs.yandex",
        removeParams: [
            "uid"
        ]
    },
    {
        domain: "doctolib.de",
        removeParams: [
            "utm_button", "utm_content-group", "utm_page-url", "utm_website"
        ]
    },
    {
        domain: "doda.jp",
        removeParams: [
            "fm", "from", "recommendID", "usrclk",
            "usrclk_searchListCassette"
        ]
    },
    {
        domain: "dollar.com",
        removeParams: [
            "SourceSystem", "iata", "sourcecode"
        ]
    },
    {
        domain: "domains.ch",
        removeParams: [
            "REF"
        ]
    },
    {
        domain: "donation.yahoo.co.jp",
        removeParams: [
            "cpt_c", "cpt_m", "cpt_n", "cpt_s"
        ]
    },
    {
        domain: "donga.com",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "douban.com",
        removeParams: [
            "_i", "dt_platform"
        ]
    },
    {
        domain: "douyin.com",
        removeParams: [
            "extra_params", "previous_page"
        ]
    },
    {
        domain: "download.mozilla.org",
        removeParams: [
            "attribution_code", "attribution_sig"
        ]
    },
    {
        domain: "dragonquest.jp",
        removeParams: [
            "_bdld"
        ]
    },
    {
        domain: "duckduckgo.com",
        removeParams: [
            "ad_domain", "ad_provider", "ad_type", "natb",
            "parent_perf_id", "perf_id", "t", "vis"
        ]
    },
    {
        domain: "dvdfab.org",
        removeParams: [
            "ad", "c_ad", "c_app", "c_app_from",
            "c_bm", "c_dt", "c_ex", "c_id",
            "c_sys", "c_u", "c_ut", "c_ver",
            "c_wh", "client_e", "client_m", "client_t",
            "clientusertype", "soft", "trackid", "ver"
        ]
    },
    {
        domain: "dw.com",
        removeParams: [
            "maca"
        ]
    },
    {
        domain: "dzen.ru",
        removeParams: [
            "clid", "persistent_id", "stid", "yredirect"
        ]
    },
    {
        domain: "dzone.com",
        removeParams: [
            "fromrel"
        ]
    },
    {
        domain: "eastday.com",
        removeParams: [
            "cvid", "qid"
        ]
    },
    {
        domain: "easyfundraising.org.uk",
        removeParams: [
            "efr_campaign", "efr_medium", "efr_source"
        ]
    },
    {
        domain: "ebay",
        removeParams: [
            "_trkparms", "_trksid", "amdata", "campid",
            "mkcid", "mkevt", "mkrid", "ssspo",
            "sssrc", "ssuid"
        ]
    },
    {
        domain: "ebay.com",
        removeParams: [
            "LH_BIN", "_from", "_trkparms", "_trksid",
            "abcId", "bu", "campid", "ch",
            "chn", "crd", "customid", "emsid",
            "euid", "hash", "mkcid", "mkevt",
            "mkgroupid", "mkpid", "mkrid", "mktype",
            "osub", "poi", "segname", "sojTags",
            "toolid", "ut"
        ]
    },
    {
        domain: "ecosia.org",
        removeParams: [
            "addon"
        ]
    },
    {
        domain: "edx.org",
        removeParams: [
            "source"
        ]
    },
    {
        domain: "ejje.weblio.jp",
        removeParams: [
            "erl"
        ]
    },
    {
        domain: "ejoker.de",
        removeParams: [
            "idealoid", "sPartner"
        ]
    },
    {
        domain: "ekstrabladet.dk",
        removeParams: [
            "account", "ilc"
        ]
    },
    {
        domain: "electrodepot.fr",
        removeParams: [
            "LGWCODE"
        ]
    },
    {
        domain: "electronic4you.de",
        removeParams: [
            "idealoid"
        ]
    },
    {
        domain: "elgato.com",
        removeParams: [
            "attribution_window", "contact_id", "link_id", "platform",
            "token"
        ]
    },
    {
        domain: "elgiganten.dk",
        removeParams: [
            "scid"
        ]
    },
    {
        domain: "email.nationalgeographic.com",
        removeParams: [
            "__F__", "__dU__"
        ]
    },
    {
        domain: "email1.io",
        removeParams: [
            "aid"
        ]
    },
    {
        domain: "entradas.com",
        removeParams: [
            "referer_info"
        ]
    },
    {
        domain: "eonline.com",
        removeParams: [
            "content", "medium", "source"
        ]
    },
    {
        domain: "epicgames.com",
        removeParams: [
            "epic_affiliate", "epic_gameId"
        ]
    },
    {
        domain: "epidemicsound.com",
        removeParams: [
            "_us", "_usx"
        ]
    },
    {
        domain: "eplus.by",
        removeParams: [
            "de_utm_source"
        ]
    },
    {
        domain: "eporner.com",
        removeParams: [
            "trx"
        ]
    },
    {
        domain: "espn.com",
        removeParams: [
            "RuleNumberdoc", "appsrc", "appsrcdoc", "ex_cid",
            "platform"
        ]
    },
    {
        domain: "etsy.com",
        removeParams: [
            "click_key", "click_sum", "gao", "gpla",
            "organic_search_click", "ref"
        ]
    },
    {
        domain: "euromaidanpress.com",
        removeParams: [
            "swcfpcdoc"
        ]
    },
    {
        domain: "euronews.com",
        removeParams: [
            "_ope"
        ]
    },
    {
        domain: "europe1.fr",
        removeParams: [
            "xtor"
        ]
    },
    {
        domain: "event.hoken-mammoth.jp",
        removeParams: [
            "s_mf"
        ]
    },
    {
        domain: "everesttech.net",
        removeParams: [
            "/ev_.*"
        ]
    },
    {
        domain: "expedia.com",
        removeParams: [
            "my_ad"
        ]
    },
    {
        domain: "express.de",
        removeParams: [
            "cb"
        ]
    },
    {
        domain: "facebook.com",
        removeParams: [
            "_nc_x", "_rdr", "action_history", "app",
            "comment_tracking", "dti", "eav", "eid",
            "extid", "ftentidentifier", "hc_=", "idorvanity",
            "ls_ref", "mibextid", "padding", "pageid",
            "paipv", "rdc", "rdr", "ref",
            "referral_code", "referral_story_type", "sfnsn", "tn",
            "tracking", "video_source", "wtsid"
        ]
    },
    {
        domain: "faei.cz",
        removeParams: [
            "dop_ab_variant", "dop_id", "dop_req_id", "dop_source_zone_name",
            "sznclid"
        ]
    },
    {
        domain: "fandom.com",
        removeParams: [
            "so"
        ]
    },
    {
        domain: "faphouse.com",
        removeParams: [
            "UserId", "login", "signature", "statsUID",
            "valid", "veb", "vep", "xhUserId"
        ]
    },
    {
        domain: "fashion-press.net",
        removeParams: [
            "media"
        ]
    },
    {
        domain: "feedspot.com",
        removeParams: [
            "_src"
        ]
    },
    {
        domain: "festo-didactic.com",
        removeParams: [
            "fbid"
        ]
    },
    {
        domain: "fifa.com",
        removeParams: [
            "entryPoint"
        ]
    },
    {
        domain: "fikfapcams.com",
        removeParams: [
            "affiliateId", "realDomain", "referrer"
        ]
    },
    {
        domain: "finance.yahoo.co.jp",
        removeParams: [
            "cpt_m", "cpt_n", "cpt_s"
        ]
    },
    {
        domain: "firefox.com",
        removeParams: [
            "context", "entrypoint", "form_type"
        ]
    },
    {
        domain: "fiverr.com",
        removeParams: [
            "afp", "bta", "context_alg", "context_referrer",
            "context_type", "cxd_token", "funnel", "is_pro",
            "pckg_id", "ref_ctx_id", "source"
        ]
    },
    {
        domain: "flipkart.com",
        removeParams: [
            "/^affExtParam/", "/^otracker/", "[cilp]id", "_refId",
            "affid", "as", "as-pos", "as-searchtext",
            "as-type", "cid", "collection-tab-name", "fm",
            "iid", "lid", "marketplace", "otracker",
            "otracker1", "pageUID", "pid", "ppn",
            "ppt", "pwsvid", "qH", "requestId",
            "spotlightTagId", "srno", "ssid", "st",
            "store", "suggestionId", "uggestionId"
        ]
    },
    {
        domain: "fmworld.net",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "fnac.com",
        removeParams: [
            "Origin", "ectrans"
        ]
    },
    {
        domain: "fon.bet",
        removeParams: [
            "affijet-click", "partner_id", "sub_1"
        ]
    },
    {
        domain: "foodpanda.com",
        removeParams: [
            "src"
        ]
    },
    {
        domain: "forbes.com",
        removeParams: [
            "sh"
        ]
    },
    {
        domain: "fortnite.com",
        removeParams: [
            "icmp"
        ]
    },
    {
        domain: "fr.shopping.rakuten.com",
        removeParams: [
            "bbaid"
        ]
    },
    {
        domain: "freebies.indiegala.com",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "fubo.tv",
        removeParams: [
            "irad", "irmp"
        ]
    },
    {
        domain: "galaxus.de",
        removeParams: [
            "idealoid", "pcscpId"
        ]
    },
    {
        domain: "game-i.daa.jp",
        removeParams: [
            "cmd"
        ]
    },
    {
        domain: "game.hiroba.dpoint.docomo.ne.jp",
        removeParams: [
            "mks_referer_event"
        ]
    },
    {
        domain: "gamedeveloper.com",
        removeParams: [
            "iiris-ref"
        ]
    },
    {
        domain: "gamersgate.com",
        removeParams: [
            "caff"
        ]
    },
    {
        domain: "gamesplanet.com",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "gamespot.com",
        removeParams: [
            "PostType", "ServiceType", "TheTime", "UniqueID",
            "ftag"
        ]
    },
    {
        domain: "gamestop.com",
        removeParams: [
            "maltcode"
        ]
    },
    {
        domain: "gamivo.com",
        removeParams: [
            "glv"
        ]
    },
    {
        domain: "gearbest.com",
        removeParams: [
            "lkid"
        ]
    },
    {
        domain: "gelocal.it",
        removeParams: [
            "cnt", "ref"
        ]
    },
    {
        domain: "geoguessr.com",
        removeParams: [
            "s"
        ]
    },
    {
        domain: "get-express-vpns.com",
        removeParams: [
            "sxid", "ttorigin"
        ]
    },
    {
        domain: "get.adobe.com",
        removeParams: [
            "TRILIBIS_EMULATOR_UA", "browser_dist", "browser_type", "promoid",
            "type", "workflow"
        ]
    },
    {
        domain: "getir.com",
        removeParams: [
            "c", "deep_link_value", "is_retargeting", "shortlink"
        ]
    },
    {
        domain: "gillian-guide.github.io",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "giphy.com",
        removeParams: [
            "cid", "ct", "ref", "rid"
        ]
    },
    {
        domain: "github.com",
        removeParams: [
            "email_source", "email_token", "ref_cta", "ref_loc",
            "ref_page", "reference_location", "source"
        ]
    },
    {
        domain: "gitlab.com",
        removeParams: [
            "glm_content", "glm_source", "ref_type", "referrer_action",
            "referrer_actiondoc"
        ]
    },
    {
        domain: "glami.cz",
        removeParams: [
            "/ga_id/"
        ]
    },
    {
        domain: "glispa.com",
        removeParams: [
            "wp_source"
        ]
    },
    {
        domain: "gmx.com",
        removeParams: [
            "p"
        ]
    },
    {
        domain: "gmx.com^",
        removeParams: [
            "mc"
        ]
    },
    {
        domain: "go.mysku.ru",
        removeParams: [
            "~r"
        ]
    },
    {
        domain: "go.redirectingat.com",
        removeParams: [
            "id", "sref", "xcust"
        ]
    },
    {
        domain: "go.skimresources.com",
        removeParams: [
            "id", "xcust"
        ]
    },
    {
        domain: "go.xliirdr.com",
        removeParams: [
            "campaignId", "p", "userId"
        ]
    },
    {
        domain: "go2games.com",
        removeParams: [
            "ranEAID", "ranMID", "ranSiteID"
        ]
    },
    {
        domain: "gog.com",
        removeParams: [
            "link_id", "pp", "track_click"
        ]
    },
    {
        domain: "goodreads.com",
        removeParams: [
            "ac", "from_search", "from_srp", "qid",
            "rank", "ref"
        ]
    },
    {
        domain: "google.com",
        removeParams: [
            "_u", "aqs", "atyp", "bih",
            "biw", "cad", "cd", "client",
            "cshid", "dcr", "dpr", "ei",
            "esrc", "fbs", "fg", "gs_lcp",
            "gs_lcrp", "gs_lp", "gs_ssp", "hl",
            "i-would-rather-use-firefox", "ictx", "ie", "iflsig",
            "je", "ls_rcp", "oq", "pcampaignid",
            "rlz", "sa", "sca_esv", "sca_upv",
            "sclient", "sei", "site", "source",
            "sourceid", "sxsrf", "uact", "usg",
            "ved", "vet"
        ]
    },
    {
        domain: "gorodche.ru",
        removeParams: [
            "utm"
        ]
    },
    {
        domain: "gotanynudes.com",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "grafana.com",
        removeParams: [
            "plcmt"
        ]
    },
    {
        domain: "greenmangaming.com",
        removeParams: [
            "/tap_.*"
        ]
    },
    {
        domain: "gumroad.com",
        removeParams: [
            "recommended_by"
        ]
    },
    {
        domain: "hao123.com",
        removeParams: [
            "tn"
        ]
    },
    {
        domain: "haokan.baidu.com",
        removeParams: [
            "pd"
        ]
    },
    {
        domain: "haokan.hao123.com",
        removeParams: [
            "context", "pd"
        ]
    },
    {
        domain: "happymail.co.jp",
        removeParams: [
            "Log"
        ]
    },
    {
        domain: "hatalike.jp",
        removeParams: [
            "track"
        ]
    },
    {
        domain: "hatarako.net",
        removeParams: [
            "prelink"
        ]
    },
    {
        domain: "hbol.jp",
        removeParams: [
            "cx_clicks_art_mdl"
        ]
    },
    {
        domain: "hd.kinopoisk.ru",
        removeParams: [
            "from_block"
        ]
    },
    {
        domain: "headlines.peta.org",
        removeParams: [
            "en_txn7"
        ]
    },
    {
        domain: "healio.com",
        removeParams: [
            "ecp", "m_bt"
        ]
    },
    {
        domain: "help.iqiyi.com",
        removeParams: [
            "entry"
        ]
    },
    {
        domain: "hepsiburada.com",
        removeParams: [
            "shortlink", "url_src", "wt_af", "wt_ds",
            "wt_gl", "wt_inf", "wt_so"
        ]
    },
    {
        domain: "heraldcorp.com",
        removeParams: [
            "pos"
        ]
    },
    {
        domain: "hh.ru",
        removeParams: [
            "exp", "grpos", "plim", "ptl",
            "stl", "swnt", "t", "vss"
        ]
    },
    {
        domain: "hinta.fi",
        removeParams: [
            "v"
        ]
    },
    {
        domain: "hit.gemius.pl",
        removeParams: [
            "extra", "id"
        ]
    },
    {
        domain: "hitseller.de",
        removeParams: [
            "etcc_cmp", "etcc_med", "etcc_produkt", "idealoid",
            "sPartner"
        ]
    },
    {
        domain: "hobbyhall.fi",
        removeParams: [
            "feat", "navigation_source"
        ]
    },
    {
        domain: "hog.com^",
        removeParams: [
            "ad"
        ]
    },
    {
        domain: "home.kingsoft.jp",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "homedepot.com",
        removeParams: [
            "fromReminder"
        ]
    },
    {
        domain: "homo.xxx",
        removeParams: [
            "ad_sub"
        ]
    },
    {
        domain: "hostinger.com",
        removeParams: [
            "session"
        ]
    },
    {
        domain: "hoteles.com",
        removeParams: [
            "/sub_.*", "PSRC", "tmid"
        ]
    },
    {
        domain: "hp.com",
        removeParams: [
            "jumpid"
        ]
    },
    {
        domain: "hpi.de",
        removeParams: [
            "tracking_id"
        ]
    },
    {
        domain: "hs.fi",
        removeParams: [
            "share"
        ]
    },
    {
        domain: "huffingtonpost.it",
        removeParams: [
            "cnt", "ref"
        ]
    },
    {
        domain: "humblebundle.com",
        removeParams: [
            "hmb_campaign", "hmb_medium", "hmb_source", "linkID",
            "mcID", "partner"
        ]
    },
    {
        domain: "idealo.com",
        removeParams: [
            "cancelUrl", "disc", "lcb", "leadOutUrl",
            "offerListId", "osId", "sid", "siteId",
            "src"
        ]
    },
    {
        domain: "idealo.de",
        removeParams: [
            "offerKey", "offerListId"
        ]
    },
    {
        domain: "ieagent.jp",
        removeParams: [
            "ct", "cv", "p", "ref"
        ]
    },
    {
        domain: "ifixit.com",
        removeParams: [
            "sponsor"
        ]
    },
    {
        domain: "igromania.ru",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "iguru.gr",
        removeParams: [
            "_unique_id", "feed_id"
        ]
    },
    {
        domain: "ilo.org",
        removeParams: [
            "ssSourceSiteId"
        ]
    },
    {
        domain: "ilsecoloxix.it",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "imdb.com",
        removeParams: [
            "pf_rd_i", "pf_rd_m", "pf_rd_p", "pf_rd_r",
            "pf_rd_s", "pf_rd_t", "ref_"
        ]
    },
    {
        domain: "immobilienscout24.de",
        removeParams: [
            "enteredFrom", "navigationServiceUrl", "referrer", "searchGeoPath",
            "searchId", "source"
        ]
    },
    {
        domain: "imobiliare.ro",
        removeParams: [
            "exprec", "rec_ref"
        ]
    },
    {
        domain: "incogni.com",
        removeParams: [
            "aff_sub", "affiliate_id", "offer_id", "source",
            "transaction_id"
        ]
    },
    {
        domain: "indeed.com",
        removeParams: [
            "[a-z]*tk", "advn", "alid", "bb",
            "from", "fvj", "jsa", "oc",
            "pub", "sal", "sjdu", "tk",
            "vjk", "vjs", "xkcb", "xpse"
        ]
    },
    {
        domain: "inews.co.uk",
        removeParams: [
            "ico"
        ]
    },
    {
        domain: "inmac-wstore.com",
        removeParams: [
            "coagent", "cotracking"
        ]
    },
    {
        domain: "instagram.com",
        removeParams: [
            "helpref", "ig_rid", "igsh", "igshid",
            "short_redirect"
        ]
    },
    {
        domain: "intersport.com",
        removeParams: [
            "cgid"
        ]
    },
    {
        domain: "investing.com",
        removeParams: [
            "smd", "udid"
        ]
    },
    {
        domain: "iotransfer.itopvpn.com",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "iplt20.com",
        removeParams: [
            "tagNames"
        ]
    },
    {
        domain: "iprima.cz",
        removeParams: [
            "dop_ab_variant", "dop_id", "dop_req_id", "dop_source_zone_name",
            "sznclid"
        ]
    },
    {
        domain: "iqbroker.com",
        removeParams: [
            "aff_model", "afftrack", "clickid"
        ]
    },
    {
        domain: "iqiyi.com",
        removeParams: [
            "bkt", "e", "flashvars", "pccenter_fr",
            "pltfm", "pos", "r_area", "r_source",
            "s_source", "source", "sr", "ssra",
            "ssrt", "stype", "vfrm", "vfrmblk",
            "vfrmrst"
        ]
    },
    {
        domain: "ixigua.com",
        removeParams: [
            "logTag"
        ]
    },
    {
        domain: "jackjones.com",
        removeParams: [
            "rm"
        ]
    },
    {
        domain: "japan.cnet.com",
        removeParams: [
            "tag"
        ]
    },
    {
        domain: "jasonsavard.com",
        removeParams: [
            "/cUrl|ref/", "cUrl"
        ]
    },
    {
        domain: "jcpenney.com",
        removeParams: [
            "Dr", "badge", "catId", "deptId",
            "productGridView", "selectedSKUId", "urlState"
        ]
    },
    {
        domain: "jdwilliams.co.uk",
        removeParams: [
            "pdpClick"
        ]
    },
    {
        domain: "jetbrains.com",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "jiji.com",
        removeParams: [
            "m"
        ]
    },
    {
        domain: "jjxx.com",
        removeParams: [
            "rm"
        ]
    },
    {
        domain: "jlcpcb.com",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "join.worldoftanks",
        removeParams: [
            "enctid", "pub_id", "sid", "xid"
        ]
    },
    {
        domain: "joshi-spa.jp",
        removeParams: [
            "cx_clicks_art_mdl", "cx_clicks_sldbox"
        ]
    },
    {
        domain: "jpsk.jp",
        removeParams: [
            "click"
        ]
    },
    {
        domain: "jula.no",
        removeParams: [
            "gclsrc"
        ]
    },
    {
        domain: "kahoot.com",
        removeParams: [
            "refer_method"
        ]
    },
    {
        domain: "kahoot.it",
        removeParams: [
            "refer_method"
        ]
    },
    {
        domain: "kakaku.com",
        removeParams: [
            "lid"
        ]
    },
    {
        domain: "kamigame.jp",
        removeParams: [
            "kamigame_source"
        ]
    },
    {
        domain: "kaspersky.com",
        removeParams: [
            "icid"
        ]
    },
    {
        domain: "kelkoogroup.net",
        removeParams: [
            "custom1"
        ]
    },
    {
        domain: "kitbag.com",
        removeParams: [
            "_ref", "ab"
        ]
    },
    {
        domain: "kitizawa.com",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "klook.com",
        removeParams: [
            "aid", "clickId", "spm"
        ]
    },
    {
        domain: "kmkk78.com",
        removeParams: [
            "agentId"
        ]
    },
    {
        domain: "kochava.com",
        removeParams: [
            "/app_.*", "device_id", "network_id"
        ]
    },
    {
        domain: "kohls.com",
        removeParams: [
            "CID", "bdrecsId", "kls_sbp", "pfm",
            "prdPV"
        ]
    },
    {
        domain: "kongregate.com",
        removeParams: [
            "acomplete"
        ]
    },
    {
        domain: "koreaherald.com",
        removeParams: [
            "ACE_SEARCH"
        ]
    },
    {
        domain: "ksta.de",
        removeParams: [
            "cb"
        ]
    },
    {
        domain: "kyujin.navitime.co.jp",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "lancasterarchery.com",
        removeParams: [
            "af_lnk", "dt_id"
        ]
    },
    {
        domain: "landevei.no",
        removeParams: [
            "email"
        ]
    },
    {
        domain: "lazada.com",
        removeParams: [
            "dsource", "exlaz", "laz_share_info", "laz_token"
        ]
    },
    {
        domain: "lcs.naver.com",
        removeParams: [
            "bh", "bw", "domComplete", "domContentLoadedEventEnd",
            "domContentLoadedEventStart", "domInteractive", "domLoading", "ln",
            "loadEventEnd", "loadEventStart", "ls", "navigationStart",
            "os", "pid", "requestStart", "responseEnd",
            "responseStart", "sr", "ts"
        ]
    },
    {
        domain: "lego.com",
        removeParams: [
            "icmp"
        ]
    },
    {
        domain: "lendgo.com",
        removeParams: [
            "apr", "lt", "rate"
        ]
    },
    {
        domain: "lenovo.com",
        removeParams: [
            "cid", "orgRef"
        ]
    },
    {
        domain: "lenta.ru",
        removeParams: [
            "es"
        ]
    },
    {
        domain: "lidea.today",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "lidl.de",
        removeParams: [
            "msktc"
        ]
    },
    {
        domain: "lightinthebox.com",
        removeParams: [
            "url"
        ]
    },
    {
        domain: "lindex.com",
        removeParams: [
            "affiliate_source"
        ]
    },
    {
        domain: "link.coupang.com",
        removeParams: [
            "lptag"
        ]
    },
    {
        domain: "linkedin.com",
        removeParams: [
            "li[a-z]{2}", "origin", "originalReferer", "original_referer",
            "refId", "trackingId", "trk", "trkInfo",
            "u", "updateEntityUrn"
        ]
    },
    {
        domain: "lite.qwant.com",
        removeParams: [
            "ad", "cachekey", "locale", "position",
            "query", "serp_position", "t", "tgp",
            "uri"
        ]
    },
    {
        domain: "live.bilibili.com",
        removeParams: [
            "broadcast_type", "is_room_feed", "session_id", "visit_id"
        ]
    },
    {
        domain: "live.nicovideo.jp",
        removeParams: [
            "ch_anime_ref"
        ]
    },
    {
        domain: "livedoor.biz",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "localmonero.co",
        removeParams: [
            "rc"
        ]
    },
    {
        domain: "login.afreecatv.com",
        removeParams: [
            "szFrom"
        ]
    },
    {
        domain: "login.yahoo.com",
        removeParams: [
            ".src", "activity", "pspid"
        ]
    },
    {
        domain: "lookmovie211.xyz",
        removeParams: [
            "sec", "sid"
        ]
    },
    {
        domain: "lotto.gmx.com^",
        removeParams: [
            "advertisementId", "partnerId"
        ]
    },
    {
        domain: "lotto.web.de",
        removeParams: [
            "advertisementId", "partnerId"
        ]
    },
    {
        domain: "lp.sophos.com",
        removeParams: [
            "elqTrackId"
        ]
    },
    {
        domain: "m.baidu.com",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "m.bilibili.com",
        removeParams: [
            "bbid", "ts"
        ]
    },
    {
        domain: "m.otenki.com",
        removeParams: [
            "af"
        ]
    },
    {
        domain: "m.weathercn.com",
        removeParams: [
            "id", "p_source", "p_type", "partner"
        ]
    },
    {
        domain: "macys.com",
        removeParams: [
            "trackingid"
        ]
    },
    {
        domain: "mag2.com",
        removeParams: [
            "trflg"
        ]
    },
    {
        domain: "magento.com",
        removeParams: [
            "itm_campaign", "itm_medium", "itm_source", "itm_term"
        ]
    },
    {
        domain: "mail.qq.com",
        removeParams: [
            "r"
        ]
    },
    {
        domain: "mailtrack.io",
        removeParams: [
            "userId"
        ]
    },
    {
        domain: "make.com",
        removeParams: [
            "fromImt"
        ]
    },
    {
        domain: "mall.kinarino.jp",
        removeParams: [
            "karea", "klay"
        ]
    },
    {
        domain: "malwarebytes.com",
        removeParams: [
            "ADDITIONAL_AFFID", "ADDITIONAL_x-source", "guard", "x-affid",
            "x-source"
        ]
    },
    {
        domain: "mamalicious.com",
        removeParams: [
            "rm"
        ]
    },
    {
        domain: "manchestereveningnews.co.uk",
        removeParams: [
            "kopdoc"
        ]
    },
    {
        domain: "manga.nicovideo.jp",
        removeParams: [
            "track"
        ]
    },
    {
        domain: "map.baidu.com",
        removeParams: [
            "compat", "da_src", "device_ratio", "newfrom",
            "pcevaname", "ugc_type", "ugc_ver"
        ]
    },
    {
        domain: "map.yahoo.co.jp",
        removeParams: [
            "from_srv"
        ]
    },
    {
        domain: "market.yandex",
        removeParams: [
            "clid", "do-waremd5", "mclid", "offerid",
            "show-uid", "uniqueId", "vid"
        ]
    },
    {
        domain: "market.yandex.ru",
        removeParams: [
            "cpc"
        ]
    },
    {
        domain: "marketing.net.idealo-partner.com",
        removeParams: [
            "amc", "etcc_cmp", "etcc_med", "etcc_produkt",
            "smc2", "smc5"
        ]
    },
    {
        domain: "marketscreener.com",
        removeParams: [
            "RewriteLast", "aComposeInputSearch", "add_mots", "countview",
            "lien", "mots", "noredirect", "type_recherche",
            "type_recherche_forum"
        ]
    },
    {
        domain: "marketwatch.com",
        removeParams: [
            "mod"
        ]
    },
    {
        domain: "marksandspencer.com",
        removeParams: [
            "bvstate"
        ]
    },
    {
        domain: "marktjagd.de",
        removeParams: [
            "client"
        ]
    },
    {
        domain: "mcafee.com",
        removeParams: [
            "ccstype", "cctype", "csrc"
        ]
    },
    {
        domain: "mechanicalkeyboards.com",
        removeParams: [
            "creator"
        ]
    },
    {
        domain: "media-cdn.costco",
        removeParams: [
            "adSize", "channelID", "hc", "location",
            "matches", "mt", "spr", "tc",
            "textadID"
        ]
    },
    {
        domain: "media.joj.sk",
        removeParams: [
            "ad_params", "ga_account", "gemius_identifier", "tracking_params"
        ]
    },
    {
        domain: "media01.eu",
        removeParams: [
            "trackid"
        ]
    },
    {
        domain: "mediamarket.com",
        removeParams: [
            "rbtc"
        ]
    },
    {
        domain: "mediamarkt.com.tr",
        removeParams: [
            "rbtc"
        ]
    },
    {
        domain: "medium.com",
        removeParams: [
            "source"
        ]
    },
    {
        domain: "meetup.com",
        removeParams: [
            "_xtd", "rv"
        ]
    },
    {
        domain: "mein.onlinekonto.de",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "mercadolibre.com",
        removeParams: [
            "DEAL_ID", "L", "S", "T",
            "V", "pdp_filters", "position", "search_layout",
            "tracking_id", "type"
        ]
    },
    {
        domain: "mercadolibre.com.ar",
        removeParams: [
            "pdp_filters"
        ]
    },
    {
        domain: "metro.co.uk",
        removeParams: [
            "ico"
        ]
    },
    {
        domain: "michaelkors.global",
        removeParams: [
            "ecid"
        ]
    },
    {
        domain: "microsoft.com",
        removeParams: [
            "/AAAA.*", "destrt", "headerid", "ocid",
            "ranEAID", "ranSiteID"
        ]
    },
    {
        domain: "microsoft.msafflnk.net",
        removeParams: [
            "sharedid"
        ]
    },
    {
        domain: "milanoo.com",
        removeParams: [
            "Promotion", "deduplication_channel"
        ]
    },
    {
        domain: "minfin.com.ua",
        removeParams: [
            "mcr", "mpl", "mpr"
        ]
    },
    {
        domain: "mintj.com",
        removeParams: [
            "adv"
        ]
    },
    {
        domain: "mioga.de",
        removeParams: [
            "idealoid", "pl"
        ]
    },
    {
        domain: "mirror.co.uk",
        removeParams: [
            "int_source"
        ]
    },
    {
        domain: "mirtesen.ru",
        removeParams: [
            "ad", "bvuuid", "nvuuid"
        ]
    },
    {
        domain: "moffme.com",
        removeParams: [
            "campaign", "medium", "source"
        ]
    },
    {
        domain: "mofos.com",
        removeParams: [
            "ats"
        ]
    },
    {
        domain: "money.smt.docomo.ne.jp",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "mongodb.com",
        removeParams: [
            "tck"
        ]
    },
    {
        domain: "monsterhunternow.com",
        removeParams: [
            "source_caller"
        ]
    },
    {
        domain: "moosejaw.com",
        removeParams: [
            "cm_lm", "cm_mmc", "spJobID", "spMailingID",
            "spReportId", "spUserID", "webUserId"
        ]
    },
    {
        domain: "mootoon.co.kr",
        removeParams: [
            "in_id"
        ]
    },
    {
        domain: "mora.jp",
        removeParams: [
            "fmid"
        ]
    },
    {
        domain: "mozilla.org",
        removeParams: [
            "platform", "redirect_source", "src"
        ]
    },
    {
        domain: "mozillazine.org",
        removeParams: [
            "sid"
        ]
    },
    {
        domain: "mp.weixin.qq.com",
        removeParams: [
            "WBAPIAnalysisOriUICodes", "abtest_cookie", "aid", "ascene",
            "chksm", "ckhsm", "count", "devicetype",
            "enterid", "exportkey", "from", "from_itemidx",
            "from_msgid", "key", "launchid", "mpshare",
            "nettype", "pass_ticket", "scene", "sessionid",
            "srcid", "subscene", "uin", "v_p",
            "version", "xtrack"
        ]
    },
    {
        domain: "msn.com",
        removeParams: [
            "cvid", "ei", "ignorejs", "ocid",
            "pc"
        ]
    },
    {
        domain: "music.apple.com",
        removeParams: [
            "itscg", "itsct"
        ]
    },
    {
        domain: "mvideo.ru",
        removeParams: [
            "/^=/"
        ]
    },
    {
        domain: "myoji-kamon.net",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "mypage.otsuka-shokai.co.jp",
        removeParams: [
            "oiid"
        ]
    },
    {
        domain: "myprotein.jp",
        removeParams: [
            "a8", "affil"
        ]
    },
    {
        domain: "n11.com",
        removeParams: [
            "adj_adnomia_click_id", "adj_t", "pfx"
        ]
    },
    {
        domain: "nationalgeographic.com",
        removeParams: [
            "utm_rd"
        ]
    },
    {
        domain: "neeva.com",
        removeParams: [
            "nva"
        ]
    },
    {
        domain: "nerdrooted.com",
        removeParams: [
            "sfw"
        ]
    },
    {
        domain: "nesine.com",
        removeParams: [
            "adj_adgroup", "adj_creative", "adjust_t", "glid",
            "rlid", "trid", "xid_param_2"
        ]
    },
    {
        domain: "net-parade.it",
        removeParams: [
            "pl"
        ]
    },
    {
        domain: "netflix.com",
        removeParams: [
            "LanguageFilter", "al", "dpRightClick", "isLanguageFilter",
            "tctx", "trackId", "trackIdEpisode", "trackIdJaw",
            "trackIdTrailer"
        ]
    },
    {
        domain: "netgames.de",
        removeParams: [
            "idealoid", "refID"
        ]
    },
    {
        domain: "netkeiba.com",
        removeParams: [
            "rf"
        ]
    },
    {
        domain: "netonnet.no",
        removeParams: [
            "dclid"
        ]
    },
    {
        domain: "newark.com",
        removeParams: [
            "COM"
        ]
    },
    {
        domain: "newegg.com",
        removeParams: [
            "nm_mc", "quicklink"
        ]
    },
    {
        domain: "news-postseven.com",
        removeParams: [
            "_from"
        ]
    },
    {
        domain: "news.yahoo.co.jp",
        removeParams: [
            "bt", "ctg", "date", "dv",
            "mid", "source"
        ]
    },
    {
        domain: "newspicks.com",
        removeParams: [
            "ref", "ref_t"
        ]
    },
    {
        domain: "newyorker.com",
        removeParams: [
            "bxid", "cndid", "esrc", "mbid",
            "source"
        ]
    },
    {
        domain: "nextdoor.com",
        removeParams: [
            "auto_token", "ct", "ec", "is",
            "link_source_user_id", "mar", "mobile_deeplink_data"
        ]
    },
    {
        domain: "nextgov.com",
        removeParams: [
            "oref"
        ]
    },
    {
        domain: "nicoebook.jp",
        removeParams: [
            "track"
        ]
    },
    {
        domain: "nicoft.io",
        removeParams: [
            "cmnhd_ref"
        ]
    },
    {
        domain: "nicovideo.jp",
        removeParams: [
            "cmnhd_ref", "news_ref", "ra", "rd",
            "ref", "rf", "rp", "track",
            "transit_from", "transition_id", "transition_type"
        ]
    },
    {
        domain: "nikkansports.com",
        removeParams: [
            "nsgid"
        ]
    },
    {
        domain: "nikkei.co",
        removeParams: [
            "adid", "i_cid", "n_cid", "waad"
        ]
    },
    {
        domain: "nikkei.com",
        removeParams: [
            "i_cid", "n_cid"
        ]
    },
    {
        domain: "nikkeibp.co.jp",
        removeParams: [
            "i_cid"
        ]
    },
    {
        domain: "nishispo.nishinippon.co.jp",
        removeParams: [
            "rct"
        ]
    },
    {
        domain: "nitter.net",
        removeParams: [
            "referer"
        ]
    },
    {
        domain: "nordot.app",
        removeParams: [
            "ncmp"
        ]
    },
    {
        domain: "nordvpn.com",
        removeParams: [
            "data1"
        ]
    },
    {
        domain: "norml.org",
        removeParams: [
            "can_id", "email_referrer", "email_subject", "link_id",
            "source"
        ]
    },
    {
        domain: "nortonsafe.search.ask.com",
        removeParams: [
            "chn", "cmpgn", "doi", "installsource",
            "olpchannel", "os", "p2", "templatecat",
            "tpr", "vendorsrc"
        ]
    },
    {
        domain: "notion.so",
        removeParams: [
            "gspk", "gsxid", "pscd"
        ]
    },
    {
        domain: "novinky.cz",
        removeParams: [
            "dop_ab_variant", "dop_id", "dop_req_id", "dop_source_zone_name",
            "seq_no", "source"
        ]
    },
    {
        domain: "nuuvem.com",
        removeParams: [
            "ranEAID", "ranMID", "ranSiteID"
        ]
    },
    {
        domain: "nvidia.com",
        removeParams: [
            "jso"
        ]
    },
    {
        domain: "nypost.com",
        removeParams: [
            "__twitter_impression"
        ]
    },
    {
        domain: "nytimes.com",
        removeParams: [
            "algodoc", "checkout_entry_point", "fellback|", "impression_id",
            "login_source", "module|", "pool|", "ref_page",
            "referringSource", "region|", "req_id|", "sgrp",
            "smid", "variant|"
        ]
    },
    {
        domain: "nytimes.com|scmp.com",
        removeParams: [
            "pgtype|", "section|"
        ]
    },
    {
        domain: "nytimes.com||microcenter.com",
        removeParams: [
            "rf"
        ]
    },
    {
        domain: "oerproject.com",
        removeParams: [
            "RegistrationSource"
        ]
    },
    {
        domain: "office.com",
        removeParams: [
            "ocid"
        ]
    },
    {
        domain: "officemonster.co.uk",
        removeParams: [
            "/fo_.*"
        ]
    },
    {
        domain: "oh-my-teeth.com",
        removeParams: [
            "clid"
        ]
    },
    {
        domain: "oikotie.fi",
        removeParams: [
            "sRef"
        ]
    },
    {
        domain: "ojrq.net",
        removeParams: [
            "cid", "tpsync"
        ]
    },
    {
        domain: "olegmakarenko.ru",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "olx.com",
        removeParams: [
            "ad_reason_recommended_items"
        ]
    },
    {
        domain: "omaha.com",
        removeParams: [
            "mode"
        ]
    },
    {
        domain: "onbuy.com",
        removeParams: [
            "exta", "stat"
        ]
    },
    {
        domain: "onenote.com",
        removeParams: [
            "fromAR", "nf"
        ]
    },
    {
        domain: "onet.pl",
        removeParams: [
            "srcc", "utm_medium", "utm_source", "utm_v"
        ]
    },
    {
        domain: "only.com",
        removeParams: [
            "rm"
        ]
    },
    {
        domain: "onlyandsons.com",
        removeParams: [
            "rm"
        ]
    },
    {
        domain: "open.spotify.com",
        removeParams: [
            "%243p", "/.*advertising_partner_name=.*", "referral", "si",
            "uid"
        ]
    },
    {
        domain: "open.substack.com",
        removeParams: [
            "rdoc"
        ]
    },
    {
        domain: "orbis.co.jp",
        removeParams: [
            "adid"
        ]
    },
    {
        domain: "oshiete.goo.ne.jp",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "ozon.ru",
        removeParams: [
            "advert", "asb", "asb2", "avtc",
            "avte", "avts", "from_sku", "from_url",
            "keywords", "partner"
        ]
    },
    {
        domain: "p3.no",
        removeParams: [
            "draftsforfriends"
        ]
    },
    {
        domain: "paypal.com",
        removeParams: [
            "calc", "mchn", "pgrp", "ppid",
            "unp_tpcid", "unptid"
        ]
    },
    {
        domain: "pb.sogou.com",
        removeParams: [
            "scrnhi", "scrnwi", "uigs_cookie", "uigs_t"
        ]
    },
    {
        domain: "pbtech.com",
        removeParams: [
            "qr"
        ]
    },
    {
        domain: "pcmag.com",
        removeParams: [
            "taid"
        ]
    },
    {
        domain: "peacocktv.com",
        removeParams: [
            "method", "orig_re", "orig_ref"
        ]
    },
    {
        domain: "perfo.salestube.pl",
        removeParams: [
            "aff_click_id"
        ]
    },
    {
        domain: "philips.com",
        removeParams: [
            "linkname", "uuid"
        ]
    },
    {
        domain: "photojobz.com",
        removeParams: [
            "hop"
        ]
    },
    {
        domain: "pinterest.com",
        removeParams: [
            "mt"
        ]
    },
    {
        domain: "pinterest.commt=signup",
        removeParams: [
            "d", "mt"
        ]
    },
    {
        domain: "pixel.adsafeprotected.com",
        removeParams: [
            "anId", "sessionId", "slot", "sr",
            "url", "wr"
        ]
    },
    {
        domain: "pixiv.net",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "play.google.com",
        removeParams: [
            "pcampaignid"
        ]
    },
    {
        domain: "play.google.com^",
        removeParams: [
            "referrer"
        ]
    },
    {
        domain: "player.theplatform.com",
        removeParams: [
            "playeranalytics", "targetedlink"
        ]
    },
    {
        domain: "playstation.com",
        removeParams: [
            "emcid"
        ]
    },
    {
        domain: "plus.yandex.com^",
        removeParams: [
            "origin", "source", "state"
        ]
    },
    {
        domain: "plusgaming.yandex.ru",
        removeParams: [
            "clckid"
        ]
    },
    {
        domain: "podbean.com",
        removeParams: [
            "pbss", "referrer"
        ]
    },
    {
        domain: "politica.com.ua",
        removeParams: [
            "isUser"
        ]
    },
    {
        domain: "popin.cc",
        removeParams: [
            "info", "uid"
        ]
    },
    {
        domain: "porntube.com",
        removeParams: [
            "cid"
        ]
    },
    {
        domain: "postnord.com",
        removeParams: [
            "mobile", "signed"
        ]
    },
    {
        domain: "pravda.com.ua",
        removeParams: [
            "pageviewCount"
        ]
    },
    {
        domain: "pricezilla.de",
        removeParams: [
            "bid"
        ]
    },
    {
        domain: "privatbank.ua",
        removeParams: [
            "visit_id"
        ]
    },
    {
        domain: "privatehomeclips.com",
        removeParams: [
            "plimit", "skip"
        ]
    },
    {
        domain: "privateinternetaccess.com",
        removeParams: [
            "brand"
        ]
    },
    {
        domain: "productcatalog.channeladvisor.com",
        removeParams: [
            "DeviceTypeId", "InteractionSessionId", "PCAT_vNextTracking_LocalWidget", "PCAT_vNextTracking_OnlineItrack",
            "PCAT_vNextTracking_OnlinePlrss", "PCAT_vNextTracking_RetailerScoring", "UniqueUserId", "profileId"
        ]
    },
    {
        domain: "productkeys.dk",
        removeParams: [
            "dTribesID"
        ]
    },
    {
        domain: "promofarma.com",
        removeParams: [
            "etf-name", "etf-prdref", "etf-publisher"
        ]
    },
    {
        domain: "promote.betcity.ru",
        removeParams: [
            "icm", "refcode", "widget_id"
        ]
    },
    {
        domain: "proshop.dk",
        removeParams: [
            "cid"
        ]
    },
    {
        domain: "prothomalo.com",
        removeParams: [
            "uuid_v2"
        ]
    },
    {
        domain: "protonvpn.com",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "prvnizpravy.cz",
        removeParams: [
            "xid"
        ]
    },
    {
        domain: "pulseway.com",
        removeParams: [
            "rfid"
        ]
    },
    {
        domain: "puma.com",
        removeParams: [
            "amp"
        ]
    },
    {
        domain: "qcplay.co.jp",
        removeParams: [
            "c", "pid", "shortlink"
        ]
    },
    {
        domain: "qianfan.cloud.baidu.com",
        removeParams: [
            "track"
        ]
    },
    {
        domain: "qjweb.jp",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "qq.com",
        removeParams: [
            "ptag"
        ]
    },
    {
        domain: "querie.me",
        removeParams: [
            "timestamp"
        ]
    },
    {
        domain: "quizangel.com",
        removeParams: [
            "utm_site_campaign", "utm_site_medium", "utm_site_source"
        ]
    },
    {
        domain: "quizlet.com",
        removeParams: [
            "funnelUUID", "signupOrigin"
        ]
    },
    {
        domain: "quora.com",
        removeParams: [
            "al_imp", "share", "uid"
        ]
    },
    {
        domain: "qvc.com",
        removeParams: [
            "qq", "sc"
        ]
    },
    {
        domain: "qwant.com",
        removeParams: [
            "client"
        ]
    },
    {
        domain: "qzone.qq.com",
        removeParams: [
            "blog_photo", "bp1", "bp2", "bp7",
            "cellid", "ciphertext", "g", "g_f",
            "jumptoqzone", "loginfrom", "res_uin", "subid",
            "subtype"
        ]
    },
    {
        domain: "rac.co.uk",
        removeParams: [
            "cid"
        ]
    },
    {
        domain: "rakumachi.jp",
        removeParams: [
            "device_type", "uiaid"
        ]
    },
    {
        domain: "rakuten.co.jp",
        removeParams: [
            "sc2id", "trflg"
        ]
    },
    {
        domain: "rapidgator.net",
        removeParams: [
            "Referer", "referer"
        ]
    },
    {
        domain: "raretech.site",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "rdrtr.com",
        removeParams: [
            "aff_sub", "aff_sub2", "aff_sub3", "aff_sub4",
            "aff_sub5", "source"
        ]
    },
    {
        domain: "readdc.com",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "realestate.yahoo.co.jp",
        removeParams: [
            "sc_out"
        ]
    },
    {
        domain: "realitykings.com",
        removeParams: [
            "ats"
        ]
    },
    {
        domain: "realtor.com",
        removeParams: [
            "MID", "RID", "ex", "identityID"
        ]
    },
    {
        domain: "record.pt",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "reddit.app.link",
        removeParams: [
            "adblock", "compact_view", "dnt", "domain",
            "feature", "geoip_country", "language", "loid",
            "loid_created", "mweb_loid", "mweb_loid_create", "mweb_user_name",
            "reddaid", "referrer_domain", "referrer_url", "session_id",
            "sr_id", "sr_name", "tags", "user_agent"
        ]
    },
    {
        domain: "reddit.com",
        removeParams: [
            "$deep_link", "$original_url", "%243p", "%24deep_link",
            "%24original_url", "?$deep_link", "_branch_match_id", "cId",
            "chainedPosts", "correlation_id", "iId", "post_fullname",
            "post_index", "rdt", "ref", "ref_campaign",
            "ref_source", "share_id", "st", "type"
        ]
    },
    {
        domain: "redfin.com",
        removeParams: [
            "riftinfo"
        ]
    },
    {
        domain: "redhotpawn.com",
        removeParams: [
            "cbqsid"
        ]
    },
    {
        domain: "redirect.appmetrica.yandex.com",
        removeParams: [
            "c"
        ]
    },
    {
        domain: "redtube.com",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "rei.com",
        removeParams: [
            "target_id"
        ]
    },
    {
        domain: "researchgate.net",
        removeParams: [
            "_tp"
        ]
    },
    {
        domain: "respekt.cz",
        removeParams: [
            "dop_ab_variant", "dop_id", "dop_req_id", "dop_source_zone_name",
            "sznclid"
        ]
    },
    {
        domain: "reuters.com",
        removeParams: [
            "edition-redirect", "taid"
        ]
    },
    {
        domain: "revolut.com",
        removeParams: [
            "%243p", "%7Ecampaign_id", "%7Eclick_id", "%7Esecondary_publisher",
            "ext"
        ]
    },
    {
        domain: "rightmove.co.uk",
        removeParams: [
            "csg"
        ]
    },
    {
        domain: "riverisland.com",
        removeParams: [
            "sem"
        ]
    },
    {
        domain: "roblox.com",
        removeParams: [
            "RelatedAssetID", "RelatedAssetType", "discoverPageSessionInfo", "gameSearchSessionInfo",
            "gameSetTargetId", "isAd", "nativeAdData", "numberOfLoadedTiles",
            "refPageId", "sortPos", "treatmentType", "universeId"
        ]
    },
    {
        domain: "roboform.com",
        removeParams: [
            "a", "affid", "c", "frm",
            "s1"
        ]
    },
    {
        domain: "saksfifthavenue.com",
        removeParams: [
            "LScreativeid", "LSlinkid", "LSoid"
        ]
    },
    {
        domain: "salming.com",
        removeParams: [
            "trackID"
        ]
    },
    {
        domain: "samsung.com",
        removeParams: [
            "cid"
        ]
    },
    {
        domain: "savefrom.net",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "sbisec.co.jp",
        removeParams: [
            "waad"
        ]
    },
    {
        domain: "search.bilibili.com",
        removeParams: [
            "from_source"
        ]
    },
    {
        domain: "search.brave.com",
        removeParams: [
            "origin", "source"
        ]
    },
    {
        domain: "search.naver.com",
        removeParams: [
            "document", "i", "image", "p",
            "px", "py", "s", "sx",
            "sy", "time", "tqi"
        ]
    },
    {
        domain: "search.yahoo.co.jp",
        removeParams: [
            "fr"
        ]
    },
    {
        domain: "search.yahoo.com",
        removeParams: [
            "fr2"
        ]
    },
    {
        domain: "secretlab.com",
        removeParams: [
            "rfsn"
        ]
    },
    {
        domain: "seiga.nicovideo.jp",
        removeParams: [
            "track"
        ]
    },
    {
        domain: "services.addons.mozilla.org",
        removeParams: [
            "telemetry-client-id"
        ]
    },
    {
        domain: "seznamzpravy.cz",
        removeParams: [
            "dop_ab_variant", "dop_id", "dop_req_id", "dop_source_zone_name",
            "seq_no", "source"
        ]
    },
    {
        domain: "sfgate.com",
        removeParams: [
            "IPID"
        ]
    },
    {
        domain: "shareasale-analytics.com",
        removeParams: [
            "afftrack", "lplid", "ref", "shrsl_analytics_sscid",
            "shrsl_analytics_sstid"
        ]
    },
    {
        domain: "shein.co.uk",
        removeParams: [
            "_t", "adp", "ici", "icn",
            "is_manual_change_site", "rep", "ret", "scici",
            "srctype", "tag_ids", "userpath"
        ]
    },
    {
        domain: "shein.com",
        removeParams: [
            "_t", "adp", "ici", "icn",
            "is_manual_change_site", "rep", "ret", "scici",
            "srctype", "tag_ids", "userpath"
        ]
    },
    {
        domain: "shimotsuke.co.jp",
        removeParams: [
            "newsletter", "rankinghour", "ref", "relatedarticle",
            "top"
        ]
    },
    {
        domain: "shop.adidas.jp",
        removeParams: [
            "shortlink", "source_caller"
        ]
    },
    {
        domain: "shop.bt.com",
        removeParams: [
            "awc"
        ]
    },
    {
        domain: "shop.hololivepro.com",
        removeParams: [
            "pr_prod_strat", "pr_rec_id", "pr_rec_pid", "pr_ref_pid",
            "pr_seq"
        ]
    },
    {
        domain: "shop.samsung.com",
        removeParams: [
            "hmz_campaign", "hmz_inf", "hmz_lid"
        ]
    },
    {
        domain: "shopbop.com",
        removeParams: [
            "extid"
        ]
    },
    {
        domain: "shopdisney.com",
        removeParams: [
            "EFC", "att"
        ]
    },
    {
        domain: "shopee.com",
        removeParams: [
            "publish_id", "sp_atk", "xptdk"
        ]
    },
    {
        domain: "shopping.gmx.com^",
        removeParams: [
            "origin"
        ]
    },
    {
        domain: "shopping.web.de",
        removeParams: [
            "origin"
        ]
    },
    {
        domain: "shrunken.com",
        removeParams: [
            "shortUrlDomain"
        ]
    },
    {
        domain: "shutterstock.com",
        removeParams: [
            "src"
        ]
    },
    {
        domain: "similarweb.com",
        removeParams: [
            "from_ext"
        ]
    },
    {
        domain: "simplelogin.io",
        removeParams: [
            "slref"
        ]
    },
    {
        domain: "simplermedia.com",
        removeParams: [
            "smg_campaign", "smg_content", "smg_medium", "smg_source"
        ]
    },
    {
        domain: "sincode.ai",
        removeParams: [
            "via"
        ]
    },
    {
        domain: "singtao.ca",
        removeParams: [
            "referid"
        ]
    },
    {
        domain: "sitepoint.com",
        removeParams: [
            "fromBlog"
        ]
    },
    {
        domain: "skt.sh",
        removeParams: [
            "referer"
        ]
    },
    {
        domain: "sky.it",
        removeParams: [
            "social", "zoneid"
        ]
    },
    {
        domain: "skyscanner.com",
        removeParams: [
            "previousCultureSource", "redirectedFrom"
        ]
    },
    {
        domain: "slack.com",
        removeParams: [
            "t"
        ]
    },
    {
        domain: "slickdeals.net",
        removeParams: [
            "adobeRef", "sdfid", "sdpid", "sdtid",
            "sdtrk"
        ]
    },
    {
        domain: "smart-flash.jp",
        removeParams: [
            "rf"
        ]
    },
    {
        domain: "smartrecruiters.com",
        removeParams: [
            "km_adgroup", "km_matchtype", "km_partner"
        ]
    },
    {
        domain: "smh.com.au",
        removeParams: [
            "btisdoc"
        ]
    },
    {
        domain: "smotreshka.tv",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "snapchat.com",
        removeParams: [
            "sc_referrer", "sc_ua"
        ]
    },
    {
        domain: "so-net.ne.jp",
        removeParams: [
            "SmRcid"
        ]
    },
    {
        domain: "sogou.com",
        removeParams: [
            "/hp.*", "/stj.*", "_asf", "_ast",
            "bh", "entityid", "fromTitle", "hintidx",
            "htdbg", "innerid", "interV", "interation",
            "lkt", "oq", "ri", "s_from",
            "sst0", "suglabid", "sugsuv", "sugtime",
            "suguuid", "sut", "w"
        ]
    },
    {
        domain: "sohu.com",
        removeParams: [
            "_f", "_trans_", "pvid", "scm",
            "spm"
        ]
    },
    {
        domain: "son-video.com",
        removeParams: [
            "ae"
        ]
    },
    {
        domain: "sony.com",
        removeParams: [
            "cpint"
        ]
    },
    {
        domain: "soundcloud.com",
        removeParams: [
            "si"
        ]
    },
    {
        domain: "sp.nicovideo.jp",
        removeParams: [
            "cnt_transit", "cp_in", "ss_id", "ss_pos",
            "viewing_source"
        ]
    },
    {
        domain: "spartoo.com",
        removeParams: [
            "sx", "track_id"
        ]
    },
    {
        domain: "spiegel.de",
        removeParams: [
            "b"
        ]
    },
    {
        domain: "sporcle.com,||hclips.com",
        removeParams: [
            "rp"
        ]
    },
    {
        domain: "sport.sky.it",
        removeParams: [
            "share_id", "social"
        ]
    },
    {
        domain: "sportbank.ua",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "sportsbull.jp",
        removeParams: [
            "vkTop"
        ]
    },
    {
        domain: "sportschosun.com",
        removeParams: [
            "f_url"
        ]
    },
    {
        domain: "spotify.com",
        removeParams: [
            "si"
        ]
    },
    {
        domain: "squarespace.com",
        removeParams: [
            "subchannel"
        ]
    },
    {
        domain: "stacksocial.com",
        removeParams: [
            "aid", "partnerid", "rid"
        ]
    },
    {
        domain: "start.pm.by",
        removeParams: [
            "adtag"
        ]
    },
    {
        domain: "startpage.com",
        removeParams: [
            "sc", "segment"
        ]
    },
    {
        domain: "steampowered.com",
        removeParams: [
            "curator_clanid", "rdt_cid", "ser", "snr"
        ]
    },
    {
        domain: "store.google.com",
        removeParams: [
            "CJAID", "CJCID"
        ]
    },
    {
        domain: "store.hbr.org",
        removeParams: [
            "fromSku", "fromSkuRelated"
        ]
    },
    {
        domain: "streamable.com",
        removeParams: [
            "src_internal", "src_player"
        ]
    },
    {
        domain: "streamfab.com^",
        removeParams: [
            "_csrc_", "_cus_", "_cut_", "c_ad",
            "client_m", "client_t"
        ]
    },
    {
        domain: "streamfab.jp",
        removeParams: [
            "ad", "c_app", "c_app_from", "c_bm",
            "c_dt", "c_sys", "c_try", "c_ut",
            "c_ver", "c_wh", "soft", "trackid"
        ]
    },
    {
        domain: "stripchat.com",
        removeParams: [
            "affiliateId", "campaignId", "realDomain", "referrer",
            "sourceId"
        ]
    },
    {
        domain: "stvkr.com",
        removeParams: [
            "height", "rfr", "sa", "timezone",
            "widht"
        ]
    },
    {
        domain: "substack.com",
        removeParams: [
            "sddoc", "triedRedirect"
        ]
    },
    {
        domain: "sun9-44.userapi.com",
        removeParams: [
            "proxy", "type"
        ]
    },
    {
        domain: "sunbasket.com",
        removeParams: [
            "msb1", "msb2", "msb3", "muts"
        ]
    },
    {
        domain: "surfshark.com",
        removeParams: [
            "transaction_id"
        ]
    },
    {
        domain: "swp.de",
        removeParams: [
            "source"
        ]
    },
    {
        domain: "t.adcell.com",
        removeParams: [
            "subId"
        ]
    },
    {
        domain: "t.myvisualiq.net",
        removeParams: [
            "~red"
        ]
    },
    {
        domain: "taobao.com",
        removeParams: [
            "_u", "abbucket", "abtest", "acm",
            "activityId", "algo_expid", "algo_pvid", "ali_refid",
            "ali_trackid", "app", "app_pvid", "bftRwd",
            "bftTag", "cpp", "impid", "lygClk",
            "mytmenu", "ns", "pos", "price",
            "ptl", "pvid", "scene", "scm",
            "scm[_a-z-]*", "share_crt_v", "shareurl", "short_name",
            "sourceType", "sp_tk", "spm", "suid",
            "traceId", "trackInfo", "turing_bucket", "un",
            "ut_sk", "utkn", "utparam", "xId"
        ]
    },
    {
        domain: "target.com",
        removeParams: [
            "clkid", "lnk", "lnm", "preselect"
        ]
    },
    {
        domain: "target.georiot.com",
        removeParams: [
            "tsid"
        ]
    },
    {
        domain: "taskrabbit.com",
        removeParams: [
            "creative_id"
        ]
    },
    {
        domain: "taxscouts.com",
        removeParams: [
            "referralSource"
        ]
    },
    {
        domain: "tb.cn",
        removeParams: [
            "sm"
        ]
    },
    {
        domain: "tcgplayer.com",
        removeParams: [
            "productLineName", "setName", "source"
        ]
    },
    {
        domain: "tchibo.de",
        removeParams: [
            "wbdcd"
        ]
    },
    {
        domain: "techcrunch.com",
        removeParams: [
            "ncid", "sr", "sr_share"
        ]
    },
    {
        domain: "technikdirekt.de",
        removeParams: [
            "idealoid", "sPartner"
        ]
    },
    {
        domain: "teknosa.com",
        removeParams: [
            "adj_adgroup", "adj_campaign", "adj_creative", "adj_t",
            "adp_cid", "adp_oid", "aid", "campid",
            "cid", "crid", "plid", "shopId",
            "sid", "source"
        ]
    },
    {
        domain: "teletrader.com",
        removeParams: [
            "internal"
        ]
    },
    {
        domain: "tempo.co",
        removeParams: [
            "tracking_page_direct"
        ]
    },
    {
        domain: "temu.com",
        removeParams: [
            "_bg_fs", "_oak_freesia_scene", "_oak_gallery_order", "_oak_mp_inf",
            "_oak_page_source", "_oak_rec_ext_1", "_oak_region", "_p_jump_id",
            "_p_rfs", "_x_ads_account", "_x_ads_channel", "_x_ads_creative_id",
            "_x_ads_id", "_x_ads_set", "_x_ads_sub_channel", "_x_campaign",
            "_x_channel_scene", "_x_channel_src", "_x_cid", "_x_gmc_account",
            "_x_gmc_catalog", "_x_ns_device", "_x_ns_match_type", "_x_ns_msclkid",
            "_x_ns_source", "_x_sessn_id", "_x_vst_scene", "freesia_scene",
            "from_share", "g_ccy", "g_lg", "g_region",
            "g_site", "mkt_rec", "refer_page_el_sn", "refer_page_id",
            "refer_page_name", "refer_page_sn", "refer_share_channel", "refer_share_id",
            "refer_share_suin", "refer_source", "share_img", "sku_id",
            "spec_gallery_id", "top_gallery_url"
        ]
    },
    {
        domain: "temu.com ",
        removeParams: [
            "_x_ns_sku_id"
        ]
    },
    {
        domain: "theathletic.com",
        removeParams: [
            "checkout_entry_point", "login_source", "ref_page", "source"
        ]
    },
    {
        domain: "thefocusfuel.com",
        removeParams: [
            "snowball"
        ]
    },
    {
        domain: "theguardian.com",
        removeParams: [
            "CMP"
        ]
    },
    {
        domain: "thehackernews.com",
        removeParams: [
            "_m"
        ]
    },
    {
        domain: "theregister.com",
        removeParams: [
            "td"
        ]
    },
    {
        domain: "thisismoney.co.uk",
        removeParams: [
            "ico", "molReferrerUrl"
        ]
    },
    {
        domain: "thumbs4.redgifs.com",
        removeParams: [
            "for"
        ]
    },
    {
        domain: "thunderbird.net",
        removeParams: [
            "src"
        ]
    },
    {
        domain: "tianqi.com",
        removeParams: [
            "cvid"
        ]
    },
    {
        domain: "tiktok.com",
        removeParams: [
            "_d", "_r", "checksum", "embed_source",
            "enter_method", "is_from_webapp", "preview_pb", "q",
            "refer", "referer_url", "referer_video_id", "sec_uid",
            "sec_user_id", "sender_device", "share_app_id", "share_app_name",
            "share_author_id", "share_iid", "share_link_id", "source",
            "t", "timestamp", "tt_from", "u_code",
            "user_id", "web_id"
        ]
    },
    {
        domain: "ting.com",
        removeParams: [
            "lpn"
        ]
    },
    {
        domain: "tinkoff.ru",
        removeParams: [
            "dsp_click_id"
        ]
    },
    {
        domain: "tipsbladet.dk",
        removeParams: [
            "eblink"
        ]
    },
    {
        domain: "tkqlhce.com",
        removeParams: [
            "sdate"
        ]
    },
    {
        domain: "tmall.com",
        removeParams: [
            "abbucket", "abtest", "acm", "activity_id",
            "algo_expid", "algo_pvid", "ali_refid", "ali_trackid",
            "app", "bftRwd", "bftTag", "bxsign",
            "cpp", "impid", "lygClk", "mytmenu",
            "ns", "pos", "price", "pvid",
            "scene", "scm[_a-z-]*", "share_crt_v", "shareurl",
            "short_name", "sourceType", "sp_tk", "suid",
            "trackInfo", "turing_bucket", "un", "user_number_id",
            "ut_sk", "utkn", "utparam"
        ]
    },
    {
        domain: "tmz.com",
        removeParams: [
            "adid"
        ]
    },
    {
        domain: "tokopedia.com",
        removeParams: [
            "extParam", "refined", "src", "trkid",
            "whid", "xClientId"
        ]
    },
    {
        domain: "toku.yahoo.co.jp",
        removeParams: [
            "fr"
        ]
    },
    {
        domain: "tokyo-calendar.jp",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "tokyo-np.co.jp",
        removeParams: [
            "rct"
        ]
    },
    {
        domain: "toomics.com",
        removeParams: [
            "channel", "gen", "pid", "subpid"
        ]
    },
    {
        domain: "track.wargaming-aff.com",
        removeParams: [
            "ref_id"
        ]
    },
    {
        domain: "track.webgains.com",
        removeParams: [
            "clickref"
        ]
    },
    {
        domain: "tradera.com",
        removeParams: [
            "transactionalEmail"
        ]
    },
    {
        domain: "tradingview.com",
        removeParams: [
            "aff_id", "aff_sub", "exchange", "source"
        ]
    },
    {
        domain: "travelist.pl",
        removeParams: [
            "MWID"
        ]
    },
    {
        domain: "trendyol.com",
        removeParams: [
            "/tyutm_.*", "adjust_t", "link_contentid", "link_userID",
            "tyutm_campaign", "tyutm_medium", "tyutm_source", "utm_subaff"
        ]
    },
    {
        domain: "trib.al",
        removeParams: [
            "__tn__", "c_", "fbclid", "h"
        ]
    },
    {
        domain: "trk.mail.ru",
        removeParams: [
            "mt_click_id"
        ]
    },
    {
        domain: "tsn.ca",
        removeParams: [
            "tsn-amp"
        ]
    },
    {
        domain: "tubepalm.com",
        removeParams: [
            "asgtbndr"
        ]
    },
    {
        domain: "tui.com",
        removeParams: [
            "agent"
        ]
    },
    {
        domain: "tumblr.app.link",
        removeParams: [
            "_p"
        ]
    },
    {
        domain: "tumblr.com",
        removeParams: [
            "is_related_post", "source"
        ]
    },
    {
        domain: "tutanota.com",
        removeParams: [
            "t-src"
        ]
    },
    {
        domain: "tweakers.net",
        removeParams: [
            "nb", "u"
        ]
    },
    {
        domain: "twitch.com",
        removeParams: [
            "tt_content", "tt_medium"
        ]
    },
    {
        domain: "twitter.com",
        removeParams: [
            "cn", "ref_src=", "ref_url", "refsrc=",
            "s", "src", "src=", "t"
        ]
    },
    {
        domain: "typeform.com",
        removeParams: [
            "typeform-source"
        ]
    },
    {
        domain: "uber.com",
        removeParams: [
            "uclick_id"
        ]
    },
    {
        domain: "ubereats.com",
        removeParams: [
            "campaign", "marketing-visitor-id", "sub-campaign"
        ]
    },
    {
        domain: "ubisoft.com",
        removeParams: [
            "maltcode"
        ]
    },
    {
        domain: "udemy.com",
        removeParams: [
            "btn", "locale", "website_id"
        ]
    },
    {
        domain: "unieuro.it",
        removeParams: [
            "dedup"
        ]
    },
    {
        domain: "upgrad.com",
        removeParams: [
            "UTM_MEDIUM"
        ]
    },
    {
        domain: "urlshare.cn",
        removeParams: [
            "_wv", "apptype", "cli_scene", "loginuin",
            "plateform", "src_scene", "src_uin", "srctype"
        ]
    },
    {
        domain: "uslecce.it",
        removeParams: [
            "et"
        ]
    },
    {
        domain: "uspoloassn.com",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "v.daum.net",
        removeParams: [
            "x_hk", "x_imp"
        ]
    },
    {
        domain: "v.youku.com",
        removeParams: [
            "ptag", "scm", "spm"
        ]
    },
    {
        domain: "vedomosti.ru",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "vercel.com",
        removeParams: [
            "redirected", "sfmc_activity_id", "sfmc_activity_name", "sfmc_activityid",
            "sfmc_asset_id", "sfmc_channel", "sfmc_journey_id", "sfmc_journey_name"
        ]
    },
    {
        domain: "verizon.com",
        removeParams: [
            "campaignGroup", "campaignName", "campaignSource", "vendorid"
        ]
    },
    {
        domain: "verkkokauppa.com",
        removeParams: [
            "list"
        ]
    },
    {
        domain: "veromoda.com",
        removeParams: [
            "rm"
        ]
    },
    {
        domain: "versioncheck.addons.mozilla.org",
        removeParams: [
            "appID"
        ]
    },
    {
        domain: "video.laxd.com",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "view.inews.qq.com",
        removeParams: [
            "ft", "refer"
        ]
    },
    {
        domain: "vimeo.com",
        removeParams: [
            "owner"
        ]
    },
    {
        domain: "vitamix.com",
        removeParams: [
            "_requestid", "bi", "cid", "di",
            "dl", "sd"
        ]
    },
    {
        domain: "vivaldi.com",
        removeParams: [
            "pk_campaign", "pk_kwd"
        ]
    },
    {
        domain: "vkplay.ru",
        removeParams: [
            "_1ld", "_1lp", "mt_adset", "mt_sub1",
            "mt_sub2"
        ]
    },
    {
        domain: "vodopad.ru",
        removeParams: [
            "sphrase_id"
        ]
    },
    {
        domain: "voicy.jp",
        removeParams: [
            "share.ref"
        ]
    },
    {
        domain: "voyeur-house.tv",
        removeParams: [
            "clickid"
        ]
    },
    {
        domain: "walmart.com",
        removeParams: [
            "/wl\d=.*", "ath[a-z]*", "classType", "from",
            "u1", "veh", "wl10", "wl11",
            "wl12"
        ]
    },
    {
        domain: "weather.com",
        removeParams: [
            "par"
        ]
    },
    {
        domain: "web.de",
        removeParams: [
            "mc", "p"
        ]
    },
    {
        domain: "web.vstat.info",
        removeParams: [
            "guid", "user_agent"
        ]
    },
    {
        domain: "websearch.rakuten.co.jp",
        removeParams: [
            "ref"
        ]
    },
    {
        domain: "weibo.com",
        removeParams: [
            "act_code", "dt_dapp", "fid", "uicode",
            "weibo_id"
        ]
    },
    {
        domain: "weibo.com^",
        removeParams: [
            "dt_dapp", "weibo_id"
        ]
    },
    {
        domain: "weidian.com",
        removeParams: [
            "distributorid", "ifr", "share_relation"
        ]
    },
    {
        domain: "welt.de",
        removeParams: [
            "wtrid"
        ]
    },
    {
        domain: "wemakeprice.com",
        removeParams: [
            "refer"
        ]
    },
    {
        domain: "wenku.baidu.com",
        removeParams: [
            "_wkts_", "aggId", "cc", "fixfr",
            "rec_flag", "sxts"
        ]
    },
    {
        domain: "wetransfer.com",
        removeParams: [
            "amp;utm_campaign", "amp;utm_medium", "amp;utm_source", "trk"
        ]
    },
    {
        domain: "wetransfer.zendesk.com",
        removeParams: [
            "amp%3Btoken", "amp%3Btrk", "amp%3Butm_campaign", "amp%3Butm_medium",
            "amp%3Butm_source"
        ]
    },
    {
        domain: "whale.naver.com",
        removeParams: [
            "wpid"
        ]
    },
    {
        domain: "whatsapp.com",
        removeParams: [
            "helpref"
        ]
    },
    {
        domain: "whistleout.com.au",
        removeParams: [
            "ARRAffinity", "ARRAffinitySameSite"
        ]
    },
    {
        domain: "whitepages.com",
        removeParams: [
            "wp_content", "wp_medium", "wp_source", "wp_term"
        ]
    },
    {
        domain: "wikihow.com",
        removeParams: [
            "utm_source"
        ]
    },
    {
        domain: "wikipedia.org",
        removeParams: [
            "wprov"
        ]
    },
    {
        domain: "windscribe.com",
        removeParams: [
            "pcpid", "temp_session"
        ]
    },
    {
        domain: "wired.co.uk",
        removeParams: [
            "mbid"
        ]
    },
    {
        domain: "wired.com",
        removeParams: [
            "intcid", "mbid"
        ]
    },
    {
        domain: "wise.com",
        removeParams: [
            "adref", "clickref", "partnerID", "partnerizecampaignID"
        ]
    },
    {
        domain: "wizcase.com",
        removeParams: [
            "clickout_id", "pageview_id", "vid"
        ]
    },
    {
        domain: "wkorea.com",
        removeParams: [
            "ddw", "ds_ch"
        ]
    },
    {
        domain: "woot.com",
        removeParams: [
            "ref_?"
        ]
    },
    {
        domain: "wowma.jp",
        removeParams: [
            "wadd"
        ]
    },
    {
        domain: "wps.com",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "wq.jd.com",
        removeParams: [
            "pvid"
        ]
    },
    {
        domain: "wsj.com",
        removeParams: [
            "inttrackingcode", "reflink", "st"
        ]
    },
    {
        domain: "wuzhuiso.com",
        removeParams: [
            "src"
        ]
    },
    {
        domain: "x.com",
        removeParams: [
            "cn", "ref_src", "ref_src=", "ref_url",
            "refsrc=", "s", "src", "src=",
            "t"
        ]
    },
    {
        domain: "xbox.com",
        removeParams: [
            "rtc", "xr"
        ]
    },
    {
        domain: "xg4ken.com",
        removeParams: [
            "criteriaid", "kchid", "kct", "kdv",
            "kpid", "locphy", "prof"
        ]
    },
    {
        domain: "xhamster.com",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "xiaohongshu.com",
        removeParams: [
            "app_platformdoc", "app_versiondoc", "apptimedoc", "appuiddoc",
            "share_from_user_hiddendoc", "xhssharedoc"
        ]
    },
    {
        domain: "xkcd.com",
        removeParams: [
            "trk"
        ]
    },
    {
        domain: "xvideos.com",
        removeParams: [
            "sxcaf"
        ]
    },
    {
        domain: "xxvidsx.com",
        removeParams: [
            "ad", "site"
        ]
    },
    {
        domain: "yahoo.co.jp",
        removeParams: [
            "ikCo", "sc_e"
        ]
    },
    {
        domain: "yahoo.com",
        removeParams: [
            "ncid"
        ]
    },
    {
        domain: "yandex",
        removeParams: [
            "clid"
        ]
    },
    {
        domain: "yandex.com",
        removeParams: [
            "clid", "did", "from", "mlid",
            "msid", "persistent_id", "sk", "source-serpid",
            "stid", "suggest_reqid", "utm-term"
        ]
    },
    {
        domain: "yiyouliao.com",
        removeParams: [
            "cvid"
        ]
    },
    {
        domain: "yle.fi",
        removeParams: [
            "origin"
        ]
    },
    {
        domain: "yna.co.kr",
        removeParams: [
            "site"
        ]
    },
    {
        domain: "you.163.com",
        removeParams: [
            "from"
        ]
    },
    {
        domain: "youku.com",
        removeParams: [
            "tpa"
        ]
    },
    {
        domain: "youtu.be",
        removeParams: [
            "si"
        ]
    },
    {
        domain: "youtube.com",
        removeParams: [
            "ab_channel", "bp", "embeds_euri", "pp",
            "source_ve_path"
        ]
    },
    {
        domain: "zapiska.substack.com",
        removeParams: [
            "isFreemail", "post_id", "publication_id", "r"
        ]
    },
    {
        domain: "zappos.com",
        removeParams: [
            "si"
        ]
    },
    {
        domain: "zavvi.com",
        removeParams: [
            "affil", "sv_campaign_id"
        ]
    },
    {
        domain: "zenaps.com",
        removeParams: [
            "bId", "cookie"
        ]
    },
    {
        domain: "zerkalo.io",
        removeParams: [
            "tg", "vk"
        ]
    },
    {
        domain: "zestradar.com",
        removeParams: [
            "adclid"
        ]
    },
    {
        domain: "zhidao.baidu.com",
        removeParams: [
            "qbl"
        ]
    },
    {
        domain: "zhihu.com",
        removeParams: [
            "hybrid_search_extra", "hybrid_search_source"
        ]
    },
    {
        domain: "zillow.com",
        removeParams: [
            "rtoken"
        ]
    },
    {
        domain: "ziprecruiter.com",
        removeParams: [
            "zrclid"
        ]
    },
    {
        domain: "zoho.com",
        removeParams: [
            "iref", "zsrc"
        ]
    },
    {
        domain: "zoominfo.com",
        removeParams: [
            "ch_source"
        ]
    },
    {
        domain: "zozo.jp",
        removeParams: [
            "t"
        ]
    }
];

  export const urlPatternRules  = [ {
    regexPattern: "^https?:\\/\\/(?:[a-z0-9-]+\\.)*?amazon(?:\\.[a-z]{2,}){1,}",
removeParams: [
   "pd_rd","pf_rd","qid","sr","srs","__mk","spIA","ms3_c","ie","refRID","colid","coliid","adId","qualifier","_encoding","smid","field-lbr_brands_browse-bin","ref","th","sprefix","crid","keywords","cv_ct_","linkCode","creativeASIN","ascsubtag","aaxitk","hsa_cr_id","sb-ci-","dchild","camp","creative","content-id","dib","dib_tag","sp_csd","tag","AssociateTag","c","hvadid","hvbmt","hvdev","hvlocphy","hvnetw","hvqmt","hvrand","hvtargid","hydadcr","initialIssue","ingress","linkId","pd_rd_i","pd_rd_r","pd_rd_w","pd_rd_wg","pf_rd_i","pf_rd_m","pf_rd_p","pf_rd_s","pf_rd_t","pf_rd_w","plattr","rdc","ts_id","visitId","vtr","store_ref","dib","ref_","pf_rd_r"
]
},
{ regexPattern: "^https?:\\/\\/(?:[a-z0-9-]+\\.)*?google(?:\\.[a-z]{2,}){1,}",
    removeParams: ["ls_rcp","gs_lcrp","gs_lcp","sca_esv","source","ei","oq","gs_lp","sclient","sourceid","ie","ved","uact","client","dpr","sei","je","usg","pcampaignid","cad","dcr","aqs","atyp","rlz","sxsrf","_u","vet","sa","esrc","cd","site","i-would-rather-use-firefox","gs_ssp","sca_upv","fbs","cshid","biw","bih","ictx","iflsig","hl","sstk"]
},
{regexFilter:"^https?:\\/\\/(?:[a-z0-9-]+\\.)*?lazda(?:\\.[a-z]{2,}){1,}",
removeParams:["clickTrackInfo","abid","pvid","ad_src","spm","src","from","scm","pa","pid_pvid","did","mp","cid","impsrc","pos"]},
{
    regexFilter:"^https?:\\/\\/(?:[a-z0-9-]+\\.)*?shopee(?:\\.[a-z]{2,}){1,}",
    removeParams:["publish_id","sp_atk","xptdk"]
}
];